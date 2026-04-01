/**
 * Migration script: Firebase Storage -> Cloudinary
 *
 * Usage: node migrate-to-cloudinary.js
 *
 * This script:
 * 1. Reads all poems, skills, others, site, poemHome, skillHome from Firebase Realtime Database
 * 2. Downloads images/audio from Firebase Storage URLs
 * 3. Uploads them to Cloudinary
 * 4. Updates the Firebase Database with new Cloudinary URLs
 */

const https = require('https');
const http = require('http');
const FormData = require('form-data');

// Config
const FIREBASE_DB_URL = 'https://powem-98484.firebaseio.com';
const CLOUDINARY_CLOUD_NAME = 'dorasgvxy';
const CLOUDINARY_UPLOAD_PRESET = 'powemsite';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

// Helper: HTTP GET that returns a buffer
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpGet(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// Helper: Read from Firebase Realtime Database
async function firebaseGet(path) {
  const url = `${FIREBASE_DB_URL}${path}.json`;
  const data = await httpGet(url);
  return JSON.parse(data.toString());
}

// Helper: Write to Firebase Realtime Database
function firebasePut(path, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${FIREBASE_DB_URL}${path}.json`);
    const body = JSON.stringify(data);
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// Helper: Upload buffer to Cloudinary
function uploadToCloudinary(buffer, folder, filename) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('file', buffer, { filename: filename || 'file' });
    form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    form.append('folder', folder);

    const url = new URL(CLOUDINARY_UPLOAD_URL);
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: form.getHeaders()
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.secure_url) {
            resolve(parsed.secure_url);
          } else {
            reject(new Error('Cloudinary error: ' + data));
          }
        } catch (e) {
          reject(new Error('Parse error: ' + data));
        }
      });
    });
    req.on('error', reject);
    form.pipe(req);
  });
}

// Check if URL is a Firebase Storage URL
function isFirebaseStorageUrl(url) {
  return url && (
    url.includes('firebasestorage.googleapis.com') ||
    url.includes('storage.googleapis.com')
  );
}

// Extract filename from Firebase Storage URL
function getFilenameFromUrl(url) {
  try {
    const decoded = decodeURIComponent(url);
    const match = decoded.match(/\/o\/(.+?)\?/);
    if (match) {
      return match[1].split('/').pop();
    }
  } catch (e) {}
  return 'file';
}

// Migrate a single URL: download from Firebase, upload to Cloudinary
async function migrateUrl(url, folder) {
  if (!isFirebaseStorageUrl(url)) {
    console.log(`  [skip] Not a Firebase URL: ${url.substring(0, 60)}...`);
    return url; // Already migrated or external URL
  }

  const filename = getFilenameFromUrl(url);
  console.log(`  [download] ${filename}...`);

  try {
    const buffer = await httpGet(url);
    console.log(`  [upload] ${filename} (${(buffer.length / 1024).toFixed(1)} KB) -> Cloudinary/${folder}/`);
    const newUrl = await uploadToCloudinary(buffer, folder, filename);
    console.log(`  [done] ${newUrl.substring(0, 80)}...`);
    return newUrl;
  } catch (err) {
    console.error(`  [ERROR] Failed to migrate ${filename}: ${err.message}`);
    return url; // Keep original URL on failure
  }
}

// Migrate an array of items (poems, skills, others)
async function migrateCollection(name, dbPath, photoFolder, audioFolder) {
  console.log(`\n=== Migrating ${name} ===`);
  const items = await firebaseGet(dbPath);

  if (!items || !Array.isArray(items)) {
    console.log(`No ${name} found or empty.`);
    return;
  }

  console.log(`Found ${items.length} ${name}.`);
  let changed = false;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item) continue;

    console.log(`\n[${i}] "${item.title || item.name || '(untitled)'}":`);

    if (item.photo && isFirebaseStorageUrl(item.photo)) {
      const newUrl = await migrateUrl(item.photo, photoFolder);
      if (newUrl !== item.photo) {
        items[i].photo = newUrl;
        changed = true;
      }
    }

    if (item.audio && isFirebaseStorageUrl(item.audio)) {
      const newUrl = await migrateUrl(item.audio, audioFolder);
      if (newUrl !== item.audio) {
        items[i].audio = newUrl;
        changed = true;
      }
    }
  }

  if (changed) {
    console.log(`\nUpdating ${name} in Firebase Database...`);
    await firebasePut(dbPath, items);
    console.log(`${name} updated successfully!`);
  } else {
    console.log(`No changes needed for ${name}.`);
  }
}

// Migrate a single object (Site, PoemHome, SkillHome)
async function migrateSingle(name, dbPath, photoFolder) {
  console.log(`\n=== Migrating ${name} ===`);
  const item = await firebaseGet(dbPath);

  if (!item) {
    console.log(`No ${name} found.`);
    return;
  }

  let changed = false;

  if (item.photo && isFirebaseStorageUrl(item.photo)) {
    const newUrl = await migrateUrl(item.photo, photoFolder);
    if (newUrl !== item.photo) {
      item.photo = newUrl;
      changed = true;
    }
  }

  if (item.audio && isFirebaseStorageUrl(item.audio)) {
    const newUrl = await migrateUrl(item.audio, photoFolder);
    if (newUrl !== item.audio) {
      item.audio = newUrl;
      changed = true;
    }
  }

  if (changed) {
    console.log(`\nUpdating ${name} in Firebase Database...`);
    await firebasePut(dbPath, item);
    console.log(`${name} updated successfully!`);
  } else {
    console.log(`No changes needed for ${name}.`);
  }
}

async function main() {
  console.log('=================================');
  console.log('Firebase Storage -> Cloudinary Migration');
  console.log('=================================');

  try {
    // Migrate poems
    await migrateCollection('Poems', '/Poems', 'images', 'audio');

    // Migrate skills
    await migrateCollection('Skills', '/Skills', 'imagesSkill', 'audioSkill');

    // Migrate others (proses)
    await migrateCollection('Others', '/Others', 'imagesOther', 'audioOther');

    // Migrate site config
    await migrateSingle('Site', '/Site', 'site');

    // Migrate poem home
    await migrateSingle('PoemHome', '/PoemHome', 'poemHome');

    // Migrate skill home
    await migrateSingle('SkillHome', '/SkillHome', 'skillHome');

    console.log('\n=================================');
    console.log('Migration complete!');
    console.log('=================================');
  } catch (err) {
    console.error('\nFATAL ERROR:', err.message);
    process.exit(1);
  }
}

main();
