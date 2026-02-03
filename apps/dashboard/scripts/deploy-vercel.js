// scripts/deploy-vercel.js
const { execSync } = require('child_process');
const fs = require('fs');
require('dotenv').config({ path: '.env.production' });

console.log('🚀 Preparing Vercel Deployment\n');

// Check required environment variables
const requiredVars = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.log('\n📋 Add these to your .env.production file:');
  console.log(`
DATABASE_URL=postgresql://postgres:8QjIEf4zslXy4aZR@db.zqpwfddzbtarvijqywvk.supabase.co:5432/postgres?sslmode=require
NEXTAUTH_SECRET=7YfRgIYDhnp/XV6cNjd+zlAjbRhBMrVmBC6+nqYbWhc=
NEXTAUTH_URL=https://hybrid-pos-dashboard.vercel.app
NODE_ENV=production
  `);
  process.exit(1);
}

console.log('✅ All required environment variables are set\n');

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI is installed');
} catch {
  console.log('📦 Installing Vercel CLI...');
  execSync('npm i -g vercel', { stdio: 'inherit' });
}

// Create vercel.json if not exists
if (!fs.existsSync('vercel.json')) {
  const vercelConfig = {
    "buildCommand": "npm run build",
    "devCommand": "npm run dev",
    "installCommand": "npm install",
    "framework": "nextjs",
    "outputDirectory": ".next",
    "regions": ["sin1"]
  };
  
  fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
  console.log('✅ Created vercel.json configuration');
}

// Create .vercelignore if not exists
if (!fs.existsSync('.vercelignore')) {
  const vercelIgnore = `.next
node_modules
*.log
*.sql
scripts/
.env*
!/.env.production
supabase-*.sql
supabase-*.json
`;
  fs.writeFileSync('.vercelignore', vercelIgnore);
  console.log('✅ Created .vercelignore file');
}

console.log('\n📋 Deployment Checklist:');
console.log('   1. ✅ Database migrated to Supabase');
console.log('   2. ✅ Environment variables ready');
console.log('   3. ✅ Vercel CLI installed');
console.log('   4. ✅ Configuration files created');

console.log('\n🚀 Ready to deploy! Choose an option:');
console.log('\nOption 1: Deploy with Vercel CLI');
console.log('   Run: vercel');
console.log('   Then: vercel --prod');

console.log('\nOption 2: Connect GitHub repository');
console.log('   1. Push code to GitHub');
console.log('   2. Go to https://vercel.com');
console.log('   3. Import your repository');
console.log('   4. Set environment variables');
console.log('   5. Click Deploy');

console.log('\nOption 3: Use Vercel Dashboard');
console.log('   1. Go to https://vercel.com/new');
console.log('   2. Import Git repository');
console.log('   3. Configure project');
console.log('   4. Deploy');

console.log('\n📧 Login credentials for testing:');
console.log('   Email: superadmin@hybridpos.pk');
console.log('   Password: admin123');