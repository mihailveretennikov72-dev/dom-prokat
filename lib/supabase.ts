import { createClient } from '@supabase/supabase-js';

// Polyfill для WebSocket (работает и на сервере, и в браузере)
let WebSocketPolyfill: any = globalThis.WebSocket;

// Проверяем, запущен ли код на сервере (Node.js)
if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  try {
    // @ts-ignore
    const ws = require('ws');
    WebSocketPolyfill = ws.WebSocket;
  } catch (e) {
    console.warn('ws package not found, using default WebSocket');
  }
}

const supabaseUrl = 'https://mmmsruuonlastzdbtvza.supabase.co';
const supabaseAnonKey = 'sb_publishable_5C5Ql7I7GIV7kxokOgDT0w_wTdU_vMv';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    transport: WebSocketPolyfill
  }
});
