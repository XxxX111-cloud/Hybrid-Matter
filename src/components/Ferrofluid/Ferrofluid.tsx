import { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh, Vec2 } from 'ogl';
import { cn } from '@/lib/utils';
import { logger } from '@lark-apaas/client-toolkit-lite';

/**
 * Ferrofluid — 基于 WebGL (ogl) 的铁磁流体效果
 *
 * 原理：
 * - 全屏片元着色器，使用多层 fbm 噪声 + 阈值模拟铁磁流体形态
 * - 支持鼠标交互：鼠标处施加扰动形成尖峰
 * - 边缘发光 + 内部半透明，呈现液态金属质感
 * - 深色背景 + 浅色流体效果最佳
 *
 * 注意：
 * - vec3 类型 uniform 使用 Float32Array 传值（ogl 要求）
 * - 使用 ResizeObserver 监听容器尺寸（PPT 翻页模式下容器初始尺寸可能为 0）
 */

interface FerrofluidProps {
  /** 流体颜色数组（3 个颜色会混合） */
  colors?: string[];
  /** 动画速度 */
  speed?: number;
  /** 流体特征大小（越大越细小） */
  scale?: number;
  /** 湍流强度 */
  turbulence?: number;
  /** 流动性（影响阈值，越大流体越多） */
  fluidity?: number;
  /** 边缘发光宽度 */
  rimWidth?: number;
  /** 边缘清晰度 */
  sharpness?: number;
  /** 闪光颗粒感 */
  shimmer?: number;
  /** 发光强度 */
  glow?: number;
  /** 流动方向 */
  flowDirection?: 'up' | 'down' | 'left' | 'right';
  /** 整体透明度 */
  opacity?: number;
  /** 是否开启鼠标交互 */
  mouseInteraction?: boolean;
  /** 鼠标影响强度 */
  mouseStrength?: number;
  /** 鼠标影响范围（相对视口短边比例 0-1） */
  mouseRadius?: number;
  /** 鼠标跟随平滑度 */
  mouseDampening?: number;
  className?: string;
}

const vertex = /* glsl */ `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uSpeed;
  uniform float uScale;
  uniform float uTurbulence;
  uniform float uFluidity;
  uniform float uRimWidth;
  uniform float uSharpness;
  uniform float uShimmer;
  uniform float uGlow;
  uniform float uFlowDir;
  uniform float uOpacity;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform float uMouseRadius;

  // ---- hash & noise ----
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    // 用 #define 循环次数避免某些 GL 编译器对 for 循环中变量条件的支持问题
    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  float turbulence(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * abs(noise(p) * 2.0 - 1.0);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 0.001);
    vec2 p = vec2(uv.x * aspect, uv.y) * uScale;

    // 流动方向（up: 流体向下移动，但视觉上像从底部向上生长；这里做向上流动）
    vec2 flow = vec2(0.0);
    if (uFlowDir < 0.5) flow = vec2(0.0,  1.0);   // up (画面上移 = 流体向上流动)
    else if (uFlowDir < 1.5) flow = vec2(0.0, -1.0); // down
    else if (uFlowDir < 2.5) flow = vec2( 1.0, 0.0); // left
    else flow = vec2(-1.0, 0.0);                      // right

    float t = uTime * uSpeed * 0.4;
    vec2 flowOffset = flow * t;

    // 多层 fbm 构造流体形态（带不同频率和相位）
    float n1 = fbm(p * 1.0 + flowOffset * 1.0 + vec2(0.0, t * 0.1));
    float n2 = fbm(p * 1.8 - flowOffset * 0.7 + vec2(t * 0.12, -t * 0.08));
    float n3 = turbulence(p * 2.5 + flowOffset * 1.3);

    // 组合形态（加权）
    float fluid = n1 * 0.55 + n2 * 0.25 + n3 * 0.2 * uTurbulence;

    // 鼠标交互：施加高斯扰动
    vec2 m = vec2(uMouse.x * aspect, uMouse.y);
    float md = distance(vec2(uv.x * aspect, uv.y), m);
    float mouseInfluence = smoothstep(uMouseRadius, 0.0, md);
    mouseInfluence = pow(mouseInfluence, 1.5) * uMouseStrength;
    fluid += mouseInfluence * 0.5;

    // ---- 主形体（body） + 边缘（rim） ----
    // uFluidity 范围 0~1，表示流体覆盖比例：越大流体越多
    float threshold = 0.62 - uFluidity * 0.24;

    float body = smoothstep(threshold - 0.04, threshold + 0.04, fluid);

    // 边缘发光：在 threshold 内侧较窄区域
    float rimInner = threshold - uRimWidth * 0.08;
    float rimOuter = threshold + uRimWidth * 0.02;
    float rim = smoothstep(rimOuter, threshold, fluid) * (1.0 - body * 0.3);
    rim = max(rim, 0.0);

    // 锐化
    body = pow(body, uSharpness * 0.45);
    rim = pow(rim, 1.0 / (uSharpness * 0.6));

    // 颗粒质感
    float grain = (hash(uv * uResolution * 0.5) - 0.5) * uShimmer * 0.15;
    body = clamp(body + grain * body, 0.0, 1.0);
    rim = clamp(rim + grain * rim * 0.5, 0.0, 1.0);

    // 颜色混合
    vec3 bodyColor = mix(uColor1, uColor2, n2);
    bodyColor = mix(bodyColor, uColor3, n3 * 0.6);

    vec3 rimColor = uColor1 * uGlow;

    // 最终颜色与透明度
    vec3 finalColor = bodyColor * body + rimColor * rim;
    float finalAlpha = (body * 0.85 + rim * 0.5) * uOpacity;
    finalAlpha = clamp(finalAlpha, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return [r, g, b];
}

function flowDirToFloat(d: FerrofluidProps['flowDirection']): number {
  switch (d) {
    case 'up': return 0;
    case 'down': return 1;
    case 'left': return 2;
    case 'right': return 3;
    default: return 0;
  }
}

export default function Ferrofluid({
  colors = ['#ffffff', '#f5f5f5', '#eaeaea'],
  speed = 0.5,
  scale = 1.6,
  turbulence = 0.9,
  fluidity = 0.5,
  rimWidth = 0.6,
  sharpness = 2.0,
  shimmer = 1.5,
  glow = 1.8,
  flowDirection = 'up',
  opacity = 0.85,
  mouseInteraction = true,
  mouseStrength = 0.8,
  mouseRadius = 0.28,
  mouseDampening = 0.12,
  className,
}: FerrofluidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseTargetRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer | null = null;
    let rafId = 0;
    let resizeObserver: ResizeObserver | null = null;

    try {
      renderer = new Renderer({
        alpha: true,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio, 1.5),
        depth: false,
        stencil: false,
        powerPreference: 'high-performance',
      } as ConstructorParameters<typeof Renderer>[0]);

      const gl = renderer.gl;
      if (!gl) throw new Error('WebGL context not available');

      gl.canvas.style.display = 'block';
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';
      container.appendChild(gl.canvas);

      // 全屏三角带（两个三角形覆盖全屏）
      const geometry = new Geometry(gl, {
        position: {
          size: 2,
          data: new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        },
      });

      const [r1, g1, b1] = hexToRgb(colors[0] ?? '#ffffff');
      const [r2, g2, b2] = hexToRgb(colors[1] ?? colors[0] ?? '#ffffff');
      const [r3, g3, b3] = hexToRgb(colors[2] ?? colors[0] ?? '#ffffff');

      // ⚠️ ogl 的 vec3 uniform 必须使用 Float32Array，不能用普通对象
      const uniforms = {
        uTime: { value: 0 },
        uResolution: { value: new Vec2(1, 1) },
        uColor1: { value: new Float32Array([r1, g1, b1]) },
        uColor2: { value: new Float32Array([r2, g2, b2]) },
        uColor3: { value: new Float32Array([r3, g3, b3]) },
        uSpeed: { value: speed },
        uScale: { value: scale },
        uTurbulence: { value: turbulence },
        uFluidity: { value: fluidity },
        uRimWidth: { value: rimWidth },
        uSharpness: { value: sharpness },
        uShimmer: { value: shimmer },
        uGlow: { value: glow },
        uFlowDir: { value: flowDirToFloat(flowDirection) },
        uOpacity: { value: opacity },
        uMouse: { value: new Vec2(0.5, 0.5) },
        uMouseStrength: { value: mouseStrength },
        uMouseRadius: { value: mouseRadius },
      };

      const program = new Program(gl, {
        vertex,
        fragment,
        uniforms,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });

      const mesh = new Mesh(gl, { geometry, program });

      // 正交视角，相机在 z=2，看向 z=0
      const camera = new Camera(gl, { fov: 45, near: 0.1, far: 100 });
      camera.position.z = 2;

      let hasSize = false;

      const resize = () => {
        if (!renderer || !container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w <= 0 || h <= 0) return;
        renderer.setSize(w, h);
        (uniforms.uResolution.value as Vec2).set(w, h);
        hasSize = true;
      };

      // 初始尺寸 + resize 监听 + ResizeObserver（PPT 模式下初始尺寸可能为 0）
      resize();

      const handleResize = () => resize();
      window.addEventListener('resize', handleResize);

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => resize());
        resizeObserver.observe(container);
      }

      // 鼠标交互
      const handleMouseMove = (e: MouseEvent) => {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        mouseTargetRef.current.x = (e.clientX - rect.left) / rect.width;
        mouseTargetRef.current.y = 1.0 - (e.clientY - rect.top) / rect.height;
      };
      if (mouseInteraction) {
        window.addEventListener('mousemove', handleMouseMove);
      }

      let startTime = performance.now();
      const mouseCurrent = { x: 0.5, y: 0.5 };

      const render = () => {
        if (!renderer || !mesh) return;
        const now = performance.now();
        const t = (now - startTime) / 1000;
        uniforms.uTime.value = t;

        if (mouseInteraction && hasSize) {
          mouseCurrent.x += (mouseTargetRef.current.x - mouseCurrent.x) * mouseDampening;
          mouseCurrent.y += (mouseTargetRef.current.y - mouseCurrent.y) * mouseDampening;
          (uniforms.uMouse.value as Vec2).set(mouseCurrent.x, mouseCurrent.y);
        }

        // 尺寸未就绪时也渲染（用默认 1x1 避免白屏）
        renderer.render({ scene: mesh, camera });
        rafId = requestAnimationFrame(render);
      };
      render();

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', handleResize);
        if (mouseInteraction) {
          window.removeEventListener('mousemove', handleMouseMove);
        }
        if (resizeObserver) {
          resizeObserver.disconnect();
          resizeObserver = null;
        }
        if (renderer && renderer.gl.canvas.parentNode) {
          renderer.gl.canvas.parentNode.removeChild(renderer.gl.canvas);
        }
        // 释放 WebGL 上下文
        if (renderer) {
          try {
            const gl = renderer.gl;
            const ext = gl.getExtension('WEBGL_lose_context');
            if (ext) ext.loseContext();
          } catch {
            // ignore
          }
        }
      };
    } catch (err) {
      // WebGL 初始化失败：静默降级
      logger.warn('[Ferrofluid] WebGL init failed, fallback disabled:', String(err));
      return () => {};
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('absolute inset-0 w-full h-full pointer-events-none', className)}
      aria-hidden="true"
      data-ferrofluid
    />
  );
}
