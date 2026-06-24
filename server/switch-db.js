import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, 'prisma/schema.prisma');

const target = process.argv[2]; // 'sqlite' or 'postgres'

if (target !== 'sqlite' && target !== 'postgres') {
  console.error("Usage: node switch-db.js [sqlite|postgres]");
  process.exit(1);
}

try {
  let content = fs.readFileSync(schemaPath, 'utf8');

  if (target === 'sqlite') {
    content = content.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
    content = content.replace(/tags\s*String\[\]\s*@default\(\[\]\)/g, 'tags             String?');
    console.log("✅ Switched schema.prisma to SQLite.");
  } else {
    content = content.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
    content = content.replace(/tags\s*String\?/g, 'tags             String[] @default([])');
    console.log("✅ Switched schema.prisma to PostgreSQL.");
  }

  fs.writeFileSync(schemaPath, content, 'utf8');
} catch (error) {
  console.error("❌ Failed to switch database provider:", error.message);
  process.exit(1);
}
