// The Gilded Vault — main.ts
// Copies game/ and screenshots/ from this repository into the output
// directory and writes dossier.json with buildDossier from the kit's
// vendor/makefun-game.ts. Node 22 standard library only.
//
// The output directory itself is never deleted (the grader's /output
// parent can be read-only); only its contents are cleared before copying.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildDossier } from './vendor/makefun-game.ts';

const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const root = new URL('.', import.meta.url).pathname;

mkdirSync(outDir, { recursive: true });

// Clear only the contents of the output dir, never the dir itself.
for (const entry of readdirSync(outDir)) {
  rmSync(join(outDir, entry), { recursive: true, force: true });
}

for (const name of ['game', 'screenshots']) {
  const src = join(root, name);
  if (!existsSync(src)) throw new Error(`main.ts: missing ${name}/ in repository`);
  cpSync(src, join(outDir, name), { recursive: true });
}

writeFileSync(join(outDir, 'dossier.json'), buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
}));

console.log(`wrote ${outDir}/dossier.json`);
