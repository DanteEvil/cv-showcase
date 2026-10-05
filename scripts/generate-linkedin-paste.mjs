/**
 * Generates LinkedIn paste-ready markdown from the CV showcase HTML.
 * Extracts `var DATA = {...}` and the print About paragraph.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Locates and evaluates the DATA object literal from HTML source.
 * @param {string} html
 * @returns {object}
 */
export function extractDataObject(html) {
  const marker = 'var DATA = ';
  const start = html.indexOf(marker);
  if (start === -1) {
    throw new Error('DATA object not found in HTML');
  }
  let i = start + marker.length;
  while (i < html.length && /\s/.test(html[i])) i++;
  if (html[i] !== '{') {
    throw new Error('DATA object does not start with {');
  }
  let depth = 0;
  let inString = false;
  let quote = '';
  let escaped = false;
  const from = i;
  for (; i < html.length; i++) {
    const ch = html[i];
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === quote) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        const literal = html.slice(from, i + 1);
        // eslint-disable-next-line no-new-func
        return Function(`"use strict"; return (${literal});`)();
      }
    }
  }
  throw new Error('Unclosed DATA object');
}

/**
 * Extracts About/summary text from print CV markup.
 * Prefers #print-about, else first <p> inside .print-cv.
 * @param {string} html
 * @returns {string}
 */
export function extractAbout(html) {
  const idMatch = html.match(
    /id=["']print-about["'][^>]*>([\s\S]*?)<\/p>/i,
  );
  if (idMatch) return decodeBasicEntities(stripTags(idMatch[1]).trim());

  const blockMatch = html.match(
    /class=["'][^"']*print-cv[^"']*["'][\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i,
  );
  if (blockMatch) return decodeBasicEntities(stripTags(blockMatch[1]).trim());

  throw new Error('About paragraph not found');
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, '');
}

function decodeBasicEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

/**
 * Formats LinkedIn-ready markdown.
 * @param {{ about: string, jobs: Array<{org:string,title:string,date:string,points:string[]}> }} input
 * @returns {string}
 */
export function formatLinkedInPaste({ about, jobs }) {
  const lines = [
    '# LinkedIn paste kit',
    '',
    '_Generated from CV-showcase. Paste sections into LinkedIn manually. Repo is source of truth._',
    '',
    '## About',
    '',
    about,
    '',
    '## Experience',
    '',
  ];
  for (const job of jobs) {
    lines.push(`### ${job.title} @ ${job.org}`);
    lines.push('');
    lines.push(job.date);
    lines.push('');
    for (const point of job.points || []) {
      lines.push(`- ${point}`);
    }
    lines.push('');
  }
  lines.push('## Checklist');
  lines.push('');
  lines.push('- [ ] Update LinkedIn About if summary changed');
  lines.push('- [ ] Update each Experience role that changed');
  lines.push('- [ ] Confirm Website / Featured points at the live Cloudflare URL');
  lines.push('');
  return lines.join('\n');
}

/**
 * Writes paste markdown to disk.
 * @param {string} outPath
 * @param {string} body
 */
export function writePasteFile(outPath, body) {
  fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });
  fs.writeFileSync(outPath, body, 'utf8');
}

/**
 * CLI entry when run directly.
 * @param {string[]} argv
 */
export function main(argv = process.argv.slice(2)) {
  const input = argv[0] || 'index.html';
  const output = argv[1] || 'linkedin-paste.md';
  const html = fs.readFileSync(input, 'utf8');
  const data = extractDataObject(html);
  const about = extractAbout(html);
  const body = formatLinkedInPaste({ about, jobs: data.jobs || [] });
  writePasteFile(output, body);
  console.log(`Wrote ${output}`);
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main();
}
