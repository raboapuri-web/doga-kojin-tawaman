import gateway, { AuthorizationState } from './index.js';

export { AuthorizationState };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'POST' && /^\/approve\/[0-9a-f-]{36}$/i.test(url.pathname)) {
      const fetchSite = request.headers.get('sec-fetch-site');
      if (fetchSite === 'cross-site') {
        return new Response('<h2>無効な送信元です。</h2>', {
          status: 403,
          headers: {
            'content-type': 'text/html; charset=utf-8',
            'cache-control': 'no-store',
            'x-content-type-options': 'nosniff',
            'x-frame-options': 'DENY',
          },
        });
      }

      // Some normal browsers/privacy modes send Origin as "null" or another
      // value that does not round-trip through workers.dev exactly. Once the
      // request is confirmed not to be cross-site, normalize Origin so the
      // existing gateway's same-origin guard can proceed to PIN validation.
      const headers = new Headers(request.headers);
      headers.set('origin', url.origin);
      request = new Request(request, { headers });
    }

    return gateway.fetch(request, env, ctx);
  },
};
