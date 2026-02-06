const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const envFiles = ['.env.local', '.env'];
const projectRoot = process.cwd();

let loadedUrl = null;

for (const file of envFiles) {
    try {
        const envPath = path.resolve(projectRoot, file);
        if (fs.existsSync(envPath)) {
            console.log(`Checking ${file}...`);
            const envConfig = fs.readFileSync(envPath, 'utf8');
            const lines = envConfig.split(/\r?\n/);
            for (const line of lines) {
                const match = line.match(/^DATABASE_URL=(.*)$/);
                if (match) {
                    let value = match[1].trim();
                    // Strip comments
                    if (value.includes('#')) {
                        value = value.split('#')[0].trim();
                    }
                    if (value.startsWith('"') && value.endsWith('"')) {
                        value = value.slice(1, -1);
                    } else if (value.startsWith("'") && value.endsWith("'")) {
                        value = value.slice(1, -1);
                    }
                    if (value) {
                        loadedUrl = value;
                        console.log(`Found DATABASE_URL in ${file}`);
                        break;
                    }
                }
            }
        }
    } catch (e) {
        console.error(`Error reading ${file}`, e);
    }
    if (loadedUrl) break;
}

if (!loadedUrl) {
    if (process.env.DATABASE_URL) {
        console.log("Using DATABASE_URL from existing process.env");
        loadedUrl = process.env.DATABASE_URL;
    } else {
        console.error("DATABASE_URL not found in .env.local or .env");
        process.exit(1);
    }
}

let url = loadedUrl;

// Append sslmode=require if missing
if (!url.includes('sslmode=')) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}sslmode=require`;
    console.log("Appended sslmode=require");
}

// Append connect_timeout=30 
if (!url.includes('connect_timeout=')) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}connect_timeout=30`;
    console.log("Appended connect_timeout=30");
}

// Check port
const portMatch = url.match(/:(\d+)(\/|\?|$)/);
if (portMatch) {
    const port = portMatch[1];
    console.log(`Detected port: ${port}`);
    if (port === '6543' && !url.includes('pgbouncer=')) {
        // Supabase Transaction Pooler usually needs pgbouncer=true for Prisma
        const separator = url.includes('?') ? '&' : '?';
        url = `${url}${separator}pgbouncer=true`;
        console.log("Appended pgbouncer=true (detected port 6543)");
    }
}

// Log masked URL
try {
    const u = new URL(url);
    console.log(`Connecting to: ${u.protocol}//${u.username}:****@${u.hostname}:${u.port}${u.pathname}${u.search}`);
} catch (e) {
    console.log("Could not parse URL for logging");
}

console.log("Running: npx prisma db pull");

try {
    execSync('npx prisma db pull', {
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: url }
    });
    console.log("Prisma db pull completed successfully.");
} catch (e) {
    console.error("Prisma db pull failed with modified URL.");
    process.exit(1);
}
