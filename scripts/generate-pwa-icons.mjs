/**
 * generate-pwa-icons.mjs
 * 构建期从 src/assets/logo-xh.png 生成 PWA 各尺寸图标（无需提交二进制）。
 * 依赖：sharp（由 build:cf 脚本在构建时临时安装，无需写入 package.json）。
 */
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src/assets/logo-xh.png');
const OUT_DIR = path.join(ROOT, 'public/icons');

async function generate(size, frac, name, outDir = OUT_DIR) {
  // 确保输出目录存在（git 不跟踪空目录，sharp 也不会自动建目录）
  fs.mkdirSync(outDir, { recursive: true });
  // 裁掉黑色背景边框
  const trimmed = await sharp(SRC).trim({ threshold: 10 }).toBuffer();
  const meta = await sharp(trimmed).metadata();

  const target = size * frac;
  const scale = target / Math.max(meta.width, meta.height);
  const w = Math.max(1, Math.round(meta.width * scale));
  const h = Math.max(1, Math.round(meta.height * scale));

  const resized = await sharp(trimmed).resize(w, h, { fit: 'fill' }).toBuffer();

  const padX = Math.round((size - w) / 2);
  const padY = Math.round((size - h) / 2);

  await sharp(resized)
    .extend({
      top: padY,
      bottom: size - h - padY,
      left: padX,
      right: size - w - padX,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    })
    .png()
    .toFile(path.join(outDir, name));
}

await Promise.all([
  generate(192, 0.8, 'icon-192.png'),
  generate(512, 0.8, 'icon-512.png'),
  generate(192, 0.62, 'maskable-192.png'),
  generate(512, 0.62, 'maskable-512.png'),
  generate(180, 0.78, 'apple-touch-icon-180.png'),
  generate(32, 0.8, 'favicon-32.png', path.join(ROOT, 'public')),
]);

console.log('[pwa] 图标生成完成 → public/icons');
