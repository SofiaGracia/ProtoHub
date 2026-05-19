const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env');
const result = dotenv.config({ path: envPath });

const hasEnv = result.error == null;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseEdgeFnUrl = process.env.SUPABASE_EDGE_FN_URL;

if (!hasEnv) {
  console.warn('⚠️  .env not found at', envPath, '— keeping placeholders in environment files');
} else if (!supabaseKey || !supabaseEdgeFnUrl) {
  console.warn('⚠️  SUPABASE_KEY or SUPABASE_EDGE_FN_URL missing in .env — keeping placeholders');
}

function injectPlaceholders(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  if (supabaseKey) {
    content = content.replace(/'SUPABASE_KEY_PLACEHOLDER'/g, `'${supabaseKey}'`);
  }
  if (supabaseEdgeFnUrl) {
    content = content.replace(/'SUPABASE_EDGE_FN_URL_PLACEHOLDER'/g, `'${supabaseEdgeFnUrl}'`);
  }
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅  ${path.basename(filePath)} — done`);
}

injectPlaceholders(path.resolve(__dirname, '..', 'src/environments/environment.ts'));
injectPlaceholders(path.resolve(__dirname, '..', 'src/environments/environment.development.ts'));
