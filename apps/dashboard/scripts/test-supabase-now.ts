console.log("🧪 Testing Supabase Connection...");

// Get the database URL from environment
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("❌ ERROR: DATABASE_URL is not set!");
  console.log("Please run: $env:DATABASE_URL = 'your-supabase-url'");
  process.exit(1);
}

console.log("🔌 URL set:", dbUrl.replace(/:([^:@]*?)@/, ":********@"));

// Try to connect
const { Client } = require('pg');

const client = new Client({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log("✅ Connected to Supabase!");
    return client.query("SELECT NOW() as time");
  })
  .then(result => {
    console.log("⏰ Database time:", result.rows[0].time);
    return client.query("SELECT version()");
  })
  .then(result => {
    console.log("📊 PostgreSQL version:", result.rows[0].version.split(" ")[1]);
    console.log("\n🎉 Connection test PASSED!");
    return client.end();
  })
  .catch(error => {
    console.error("\n❌ Connection FAILED:", error.message);
    console.log("\n🔧 Common issues:");
    console.log("1. Wrong password in DATABASE_URL");
    console.log("2. Supabase project not active");
    console.log("3. Network/firewall blocking connection");
    process.exit(1);
  });
'@ | Out-File -FilePath scripts/test-simple.js -Encoding UTF8
