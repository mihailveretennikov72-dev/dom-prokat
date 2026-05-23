import { createClient } from '@supabase/supabase-js';

// Магия: используем ws только если мы на сервере (во время сборки)
let WebSocketPolyfill = globalThis.WebSocket;

if (typeof process !== 'undefined' && typeof process.versions === 'object' && process.versions.node) {
    // @ts-ignore
    const ws = require('ws');
    WebSocketPolyfill = ws.WebSocket;
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    transport: WebSocketPolyfill
  }
});
