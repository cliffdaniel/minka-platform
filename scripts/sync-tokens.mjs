// Genera minka-web/src/presentation/theme/tokens.css desde docs/design-system/tokens.json.
// Uso: node scripts/sync-tokens.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(readFileSync(join(root, 'docs/design-system/tokens.json'), 'utf8'));

const unit = { space: 'px', radius: 'px', typeSize: 'px', layout: 'px', motionMs: 'ms', breakpoint: 'px', focus: 'px' };
const prefix = { color: 'color', space: 'space', radius: 'radius', typeSize: 'type', layout: 'layout', motionMs: 'motion', layers: 'layer', lineHeight: 'line', fontWeight: 'weight', breakpoint: 'breakpoint', shadow: 'shadow', focus: 'focus' };

const lines = [];
for (const [group, values] of Object.entries(tokens)) {
    if (!prefix[group]) continue;
    lines.push(`    /* ${group} */`);
    for (const [name, value] of Object.entries(values)) {
        lines.push(`    --minka-${prefix[group]}-${name}: ${value}${typeof value === 'number' ? (unit[group] ?? '') : ''};`);
    }
}
const css = `/* Generado por scripts/sync-tokens.mjs desde docs/design-system/tokens.json. No editar a mano. */\n:root {\n${lines.join('\n')}\n}\n`;
writeFileSync(join(root, 'minka-web/src/presentation/theme/tokens.css'), css);
console.log(`tokens.css: ${lines.filter((line) => line.includes('--minka-')).length} tokens`);
