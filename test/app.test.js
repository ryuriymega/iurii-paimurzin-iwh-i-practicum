const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../index');

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve, reject) => {
    server = app.listen(0, '127.0.0.1', resolve);
    server.once('error', reject);
  });

  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (!server) return;
  await new Promise((resolve) => server.close(resolve));
});

test('GET /update-cobj renders the required creation form', async () => {
  const response = await fetch(`${baseUrl}/update-cobj`);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Update Custom Object Form \| Integrating With HubSpot I Practicum/);
  assert.match(html, /href="\/">Return to the homepage<\/a>/);
  assert.match(html, /name="name"/);
  assert.match(html, /name="role"/);
  assert.match(html, /name="terminal_controller_url"/);
});

test('POST /update-cobj validates required fields and HTTPS URLs', async () => {
  const response = await fetch(`${baseUrl}/update-cobj`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      name: '',
      role: 'Test role',
      terminal_controller_url: 'http://example.com/agent',
    }),
  });
  const html = await response.text();

  assert.equal(response.status, 400);
  assert.match(html, /Name is required\./);
  assert.match(html, /Terminal Controller URL must use HTTPS\./);
  assert.match(html, /value="Test role"/);
});
