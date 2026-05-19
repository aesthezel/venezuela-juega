/**
 * Design Token Migration Script
 * Renames old Tailwind class patterns to new design token names.
 * Run: node scripts/migrate-tokens.js
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const SRC_DIR = join(import.meta.dirname, '..', 'src');

// ─── Replacement map: order matters (longer patterns first) ───
const REPLACEMENTS = [
  // Slate → Surface (Tailwind class patterns)
  // Be specific: match word boundaries in class contexts
  ['slate-950', 'surface-950'],
  ['slate-900', 'surface-900'],
  ['slate-800', 'surface-800'],
  ['slate-700', 'surface-700'],
  ['slate-600', 'surface-600'],
  ['slate-500', 'surface-500'],
  ['slate-400', 'surface-400'],
  ['slate-300', 'surface-300'],
  ['slate-200', 'surface-200'],
  ['slate-100', 'surface-100'],
  ['slate-50', 'surface-50'],

  // Cyan → Accent Teal
  ['cyan-950', 'accent-teal-deep'],
  ['cyan-900', 'accent-teal-deep'],
  ['cyan-700', 'accent-teal-dark'],
  ['cyan-600', 'accent-teal-dark'],
  ['cyan-500', 'accent-teal-dark'],
  ['cyan-400', 'accent-teal'],
  ['cyan-300', 'accent-teal'],
  ['cyan-200', 'accent-teal'],
  ['cyan-100', 'accent-teal'],
  ['cyan-50', 'surface-50'],

  // Yellow → Brand Gold
  ['yellow-700', 'brand-gold'],
  ['yellow-500', 'brand-gold'],
  ['yellow-400', 'brand-gold'],
  ['yellow-300', 'brand-gold'],

  // Blue → Brand Blue
  ['blue-600', 'brand-blue'],
  ['blue-500', 'brand-blue'],
  ['blue-400', 'brand-blue'],

  // Red → Brand Red
  ['red-600', 'brand-red-dark'],
  ['red-500', 'brand-red'],
  ['red-400', 'brand-red'],
  ['red-100', 'brand-red'],

  // Indigo → Accent Indigo
  ['indigo-700', 'accent-indigo'],
  ['indigo-600', 'accent-indigo-dark'],
  ['indigo-500', 'accent-indigo'],
  ['indigo-400', 'accent-indigo'],
  ['indigo-300', 'accent-indigo'],

  // Emerald → Accent Lime
  ['emerald-600', 'accent-lime-dark'],
  ['emerald-500', 'accent-lime-dark'],
  ['emerald-400', 'accent-lime'],
  ['emerald-300', 'accent-lime'],

  // Orange → Accent Orange
  ['orange-900', 'accent-orange'],
  ['orange-700', 'accent-orange'],
  ['orange-600', 'accent-orange'],
  ['orange-500', 'accent-orange'],
  ['orange-400', 'accent-orange'],
  ['orange-300', 'accent-orange'],
  ['orange-200', 'accent-orange'],

  // Purple → Accent Mauve
  ['purple-700', 'accent-mauve-dark'],
  ['purple-600', 'accent-mauve-deep'],
  ['purple-500', 'accent-mauve-dark'],
  ['purple-400', 'accent-mauve'],
  ['purple-300', 'accent-mauve'],
];

// Also replace CSS variable references like var(--color-slate-950) → var(--color-surface-950)
const CSS_VAR_REPLACEMENTS = REPLACEMENTS.map(([from, to]) => [
  `--color-${from}`,
  `--color-${to}`,
]);

function getAllFiles(dir, extensions = ['.tsx', '.ts']) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      if (entry === 'node_modules' || entry === 'dist' || entry === 'styles') continue;
      results.push(...getAllFiles(fullPath, extensions));
    } else if (extensions.includes(extname(fullPath))) {
      results.push(fullPath);
    }
  }
  return results;
}

function migrateFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  const original = content;

  // Apply CSS variable replacements first (more specific)
  for (const [from, to] of CSS_VAR_REPLACEMENTS) {
    content = content.replaceAll(from, to);
  }

  // Apply Tailwind class replacements
  for (const [from, to] of REPLACEMENTS) {
    content = content.replaceAll(from, to);
  }

  if (content !== original) {
    writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  return false;
}

// Run
const files = getAllFiles(SRC_DIR);
let changed = 0;
for (const file of files) {
  if (migrateFile(file)) {
    changed++;
    console.log(`  ✓ ${file.replace(SRC_DIR, 'src')}`);
  }
}
console.log(`\n✅ Migrated ${changed}/${files.length} files.`);