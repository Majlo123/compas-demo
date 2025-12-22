// encode-basic-auth.js
// Usage:
//   node encode-basic-auth.js my-username my-api-token
//
// Output:
//   Basic <base64>

const [,, username, apiToken] = process.argv;

if (!username || !apiToken) {
  console.error('Usage: node encode-basic-auth.js <username> <apiToken>');
  process.exit(1);
}

const raw = `${username}:${apiToken}`;
const base64 = Buffer.from(raw, 'utf8').toString('base64');

console.log(`Raw: ${raw}`);
console.log(`Base64: ${base64}`);
console.log(`Authorization header: Basic ${base64}`);