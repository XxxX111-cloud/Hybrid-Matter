import { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh, Vec2, Raycast, Plane } from 'ogl';
import { cn } from '@/lib/utils';
import { logger } from '@lark-apaas/client-toolkit-lite';

/**
 * LightRays — 基于 WebGL (ogl) 的体积光/光线散射效果
 *
 * 原理：
 * - 全屏片元着色器，从指定 origin 发射多条光线
 * - 使用简单的噪声 + 距离衰减模拟丁达尔效应 / 体积光
 * - 支持鼠标交互（光线随鼠标轻微偏移）
 * - 深色背景 + 浅色光线效果最佳
 *
 * 适配 PPT 翻页模式：
 * - 组件挂载时初始化，卸载时释放 WebGL 资源
 * - Fullpage Provider 会在页面切换时重新挂载子组件，因此每次进入页面都会重新初始化
 */

interface LightRaysProps {
  /** 光线发射位置 */
  raysOrigin?: 'top-center' | 'bottom-center' | 'center' | 'top-left' | 'top-right';
  /** 光线颜色（HEX） */
  raysColor?: string;
  /** 光线动画速度 */
  raysSpeed?: number;
  /** 光线扩散范围（0-1） */
  lightSpread?: number;
  /** 光线长度（相对屏幕高度倍数） */
  rayLength?: number;
  /** 是否开启脉冲效果 */
  pulsating?: boolean;
  /** 衰减距离（0-2） */
  fadeDistance?: number;
  /** 饱和度（0-1） */
  saturation?: number;
  /** 是否跟随鼠标 */
  followMouse?: boolean;
  /** 鼠标影响强度（0-1） */
  mouseInfluence?: number;
  /** 噪波量（0-1），增加有机质感 */
  noiseAmount?: number;
  /** 扭曲量（0-1） */
  distortion?: number;
  /** 光线数量（建议 8-24） */
  rayCount?: number;
  /** 透明度（0-1），整体亮度调节 */
  intensity?: number;
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
  uniform vec2 uOrigin;      // 0-1 空间，光线发射原点
  uniform vec3 uRaysColor;
  uniform float uRaysSpeed;
  uniform float uLightSpread;
  uniform float uRayLength;
  uniform float uPulsating;
  uniform float uFadeDistance;
  uniform float uSaturation;
  uniform vec2 uMouse;       // 0-1 空间
  uniform float uMouseInfluence;
  uniform float uNoiseAmount;
  uniform float uDistortion;
  uniform float uRayCount;
  uniform float uIntensity;

  // 简易哈希噪声
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
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
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 center = uOrigin;

    // 鼠标影响：轻微偏移 origin
    vec2 mouseOffset = (uMouse - 0.5) * uMouseInfluence * 0.3;
    center += mouseOffset;

    // 计算到 origin 的方向与距离（考虑宽高比）
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 toUv = (uv - center) * aspect;
    float dist = length(toUv);

    // 角度（弧度）
    float angle = atan(toUv.y, toUv.x);

    // 基础强度：距离越远越弱
    float distFade = 1.0 - smoothstep(0.0, uFadeDistance * 0.8, dist);
    distFade = max(distFade, 0.0);

    // 径向条纹（光线主体）
    float rays = 0.0;
    float n = uRayCount;

    // 动态扭曲
    float twist = uDistortion * fbm(uv * 3.0 + uTime * 0.1 * uRaysSpeed) * 0.5;

    // 基于角度的光线分布
    float ang = angle / 6.28318 * n + twist * 2.0;
    float rayId = floor(ang);
    float rayFrac = fract(ang);

    // 每条光线的随机参数
    float rayHash = hash(vec2(rayId, 0.0));
    float rayStrength = 0.4 + 0.6 * rayHash;
    float rayPhase = uTime * uRaysSpeed * (0.5 + rayHash) + rayId * 0.3;
    float rayPulse = 0.8 + 0.2 * sin(rayPhase);

    // 光线宽度（由 spread 控制）
    float rayWidth = (0.15 / n) * (2.0 - uLightSpread);
    float rayShape = smoothstep(rayWidth, 0.0, abs(rayFrac - 0.5));
    rayShape = pow(rayShape, 1.5);

    // 长度变化：每条光线长度不同
    float lenMod = 0.6 + 0.4 * fbm(vec2(rayId * 0.1, uTime * 0.2 * uRaysSpeed));
    float lenFade = 1.0 - smoothstep(0.0, uRayLength * lenMod * 0.6, dist);
    lenFade = max(lenFade, 0.0);

    rays = rayShape * rayStrength * rayPulse * lenFade;

    // 全局脉冲
    if (uPulsating > 0.5) {
      float pulse = 0.85 + 0.15 * sin(uTime * 1.2);
      rays *= pulse;
    }

    // 噪点质感
    float grain = fbm(uv * 8.0 + uTime * 0.05) * uNoiseAmount * 0.5;
    rays += grain * rays;

    // 距离衰减（再次叠加，让远端更柔和）
    rays *= distFade;

    // 最终颜色
    vec3 col = uRaysColor * rays * uIntensity;

    // 饱和度调节
    float gray = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(gray), col, uSaturation);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return [r, g, b];
}

function getOrigin(origin: LightRaysProps['raysOrigin']): [number, number] {
  switch (origin) {
    case 'top-center': return [0.5, 1.0];
    case 'bottom-center': return [0.5, 0.0];
    case 'center': return [0.5, 0.5];
    case 'top-left': return [0.0, 1.0];
    case 'top-right': return [1.0, 1.0];
    default: return [0.5, 1.0];
  }
}

export default function LightRays({
  raysOrigin = 'top-center',
  raysColor = '#ffffff',
  raysSpeed = 1.2,
  lightSpread = 0.7,
  rayLength = 1.8,
  pulsating = false,
  fadeDistance = 1.2,
  saturation = 1.0,
  followMouse = true,
  mouseInfluence = 0.15,
  noiseAmount = 0.08,
  distortion = 0.08,
  rayCount = 16,
  intensity = 0.8,
  className,
}: LightRaysProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer | null = null;
    let rafId = 0;
    let program: Program | null = null;
    let mesh: Mesh | null = null;

    try {
      renderer = new Renderer({
        alpha: true,
        antialias: true,
        dpr: Math.min(window.devicePixelRatio, 2),
      });
      const gl = renderer.gl;
      container.appendChild(gl.canvas);
      gl.canvas.style.display = 'block';
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';

      // 全屏平面
      const geometry = new Geometry(gl, {
        position: {
          size: 2,
          data: new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        },
      });

      const originVal = getOrigin(raysOrigin);
      const [r, g, b] = hexToRgb(raysColor);

      const uniforms = {
        uTime: { value: 0 },
        uResolution: { value: new Vec2(1, 1) },
        uOrigin: { value: new Vec2(originVal[0], originVal[1]) },
        uRaysColor: { value: new (Vec2 as any)(r, g, b) || { x: r, y: g, z: b } },
        uRaysSpeed: { value: raysSpeed },
        uLightSpread: { value: lightSpread },
        uRayLength: { value: rayLength },
        uPulsating: { value: pulsating ? 1.0 : 0.0 },
        uFadeDistance: { value: fadeDistance },
        uSaturation: { value: saturation },
        uMouse: { value: new Vec2(0.5, 0.5) },
        uMouseInfluence: { value: mouseInfluence },
        uNoiseAmount: { value: noiseAmount },
        uDistortion: { value: distortion },
        uRayCount: { value: rayCount },
        uIntensity: { value: intensity },
      };

      // 修正：Vec2 只有两个分量，uRaysColor 需要三维度
      // 改用普通对象
      uniforms.uRaysColor = { value: { x: r, y: g, z: b } };

      program = new Program(gl, {
        vertex,
        fragment,
        uniforms,
      });

      mesh = new Mesh(gl, { geometry, program });

      // 简单的相机（正交视角，片元着色器自行处理 UV）
      const camera = new Camera(gl, { fov: 45, near: 0.1, far: 100 });
      camera.position.z = 2;

      // 尺寸调整
      const resize = () => {
        if (!renderer || !container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        renderer.setSize(w, h);
        (uniforms.uResolution.value as Vec2).set(w, h);
      };
      resize();
      window.addEventListener('resize', resize);

      // 鼠标
      const handleMouseMove = (e: MouseEvent) => {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1.0 - (e.clientY - rect.top) / rect.height;
        mouseRef.current.x = x;
        mouseRef.current.y = y;
      };
      if (followMouse) {
        window.addEventListener('mousemove', handleMouseMove);
      }

      let startTime = performance.now();

      const render = () => {
        if (!renderer || !mesh) return;
        const now = performance.now();
        const t = (now - startTime) / 1000;
        uniforms.uTime.value = t;

        if (followMouse) {
          // 平滑跟随
          const m = uniforms.uMouse.value as Vec2;
          m.x += (mouseRef.current.x - m.x) * 0.05;
          m.y += (mouseRef.current.y - m.y) * 0.05;
        }

        renderer.render({ scene: mesh, camera });
        rafId = requestAnimationFrame(render);
      };
      render();

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
        if (followMouse) {
          window.removeEventListener('mousemove', handleMouseMove);
        }
        if (renderer && renderer.gl.canvas.parentNode) {
          renderer.gl.canvas.parentNode.removeChild(renderer.gl.canvas);
        }
        // 释放 WebGL 资源
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
      // WebGL 初始化失败：降级为静态深色背景
      logger.warn('LightRays WebGL 初始化失败，已降级', String(err));
      return () => {};
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('absolute inset-0 w-full h-full pointer-events-none', className)}
      aria-hidden="true"
    />
  );
}
