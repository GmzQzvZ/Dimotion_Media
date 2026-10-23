import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { app } from '../src/app.js';
import { createCampaignSchema } from '../src/modules/campaigns/campaign.validation.js';

let server: Server;
let baseUrl: string;

before(async () => {
  server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

test('health endpoint is public and reports the API status', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok', service: 'dimotion-api' });
});

test('protected routes reject requests without a bearer token', async () => {
  const response = await fetch(`${baseUrl}/api/campaigns`);
  assert.equal(response.status, 401);
  assert.equal(typeof (await response.json()).error, 'string');
});

test('admin-only routes reject unauthenticated requests', async () => {
  const response = await fetch(`${baseUrl}/api/packages/manage`);
  assert.equal(response.status, 401);
});

test('unknown API routes return a not-found response', async () => {
  const response = await fetch(`${baseUrl}/api/not-a-module`);
  assert.equal(response.status, 404);
});

test('campaign creation rejects unknown fields and malformed identifiers', () => {
  const result = createCampaignSchema.safeParse({
    brandId: 'not-a-uuid',
    title: 'Lanzamiento',
    unexpected: true,
  });
  assert.equal(result.success, false);
});

test('campaign creation accepts the documented fields', () => {
  const result = createCampaignSchema.safeParse({
    brandId: '163c6f69-144c-41d6-831c-dfb8659cbeb1',
    packageId: null,
    title: 'Lanzamiento',
    description: 'Producción audiovisual',
  });
  assert.equal(result.success, true);
});
