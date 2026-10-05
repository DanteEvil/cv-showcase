import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  extractAbout,
  extractDataObject,
  formatLinkedInPaste,
  writePasteFile,
} from '../scripts/generate-linkedin-paste.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixture = fs.readFileSync(
  path.join(__dirname, 'fixtures', 'sample-index.html'),
  'utf8',
);

const data = extractDataObject(fixture);
assert.equal(data.jobs.length, 2);
assert.equal(data.jobs[0].org, 'Acme');

const about = extractAbout(fixture);
assert.match(about, /Senior engineer summary/);

const body = formatLinkedInPaste({ about, jobs: data.jobs });
assert.match(body, /## About/);
assert.match(body, /### Engineer @ Acme/);
assert.match(body, /2020 — Present/);
assert.match(body, /Shipped feature A/);
assert.match(body, /### Developer @ Beta Co/);

const tmp = path.join(os.tmpdir(), `linkedin-paste-${process.pid}.md`);
writePasteFile(tmp, body);
assert.ok(fs.existsSync(tmp));
assert.match(fs.readFileSync(tmp, 'utf8'), /## About/);
fs.unlinkSync(tmp);

console.log('ok - generate-linkedin-paste');
