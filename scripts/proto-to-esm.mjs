// Post-processes protoc's CommonJS message files (import_style=commonjs) into
// ES modules. The generated code only attaches exports dynamically
// (goog.object.extend(exports, proto.netem)), which browser-native ESM and
// Rollup cannot statically see; this rewrites the requires to imports and the
// exports merge to explicit named exports.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PROTO_DIR = new URL('../src/proto/', import.meta.url).pathname;

for (const file of readdirSync(PROTO_DIR)) {
  if (!file.endsWith('_pb.js') || file.endsWith('grpc_pb.js')) continue;
  const path = join(PROTO_DIR, file);
  let code = readFileSync(path, 'utf8');

  if (!code.includes('goog.object.extend(exports,')) {
    continue; // already converted or not a message file
  }

  const nsMatch = code.match(/goog\.object\.extend\(exports, proto\.(\w+)\);/);
  const ns = nsMatch[1];

  const names = new Set(
    [...code.matchAll(new RegExp(`goog\\.exportSymbol\\('proto\\.${ns}\\.([A-Za-z0-9_]+)',`, 'g'))]
      .map((m) => m[1]),
  );

  code = code
    .replace(
      /^var (\w+) = require\('([^']+)'\);$/gm,
      (_, name, spec) => `import ${name} from '${spec}';`,
    )
    .replace(
      /goog\.object\.extend\(exports, proto\.\w+\);/,
      [...names].map((n) => `export const ${n} = proto.${ns}.${n};`).join('\n'),
    );

  writeFileSync(path, code);
  console.log(`proto-to-esm: converted ${file} (${names.size} exports)`);
}
