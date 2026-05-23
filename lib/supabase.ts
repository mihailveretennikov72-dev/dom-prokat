import { createClient } from '@supabase/supabase-js';

// Проверяем, запущен ли код на сервере (Node.js) или в браузере
let WebSocketPolyfill: any = globalThis.WebSocket;

if (typeof process !== 'undefined' && process.versions && process.versions.node) {
  try {
    // @ts-ignore
    const ws = require('ws');
    WebSocketPolyfill = ws.WebSocket;
  } catch (e) {
    console.warn('ws package not found, using default WebSocket');
  }
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    transport: WebSocketPolyfill
  }
});
