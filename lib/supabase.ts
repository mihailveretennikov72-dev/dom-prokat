import { createClient } from '@supabase/supabase-js';

// Умная проверка: используем ws только на сервере (во время сборки)
let WebSocketPolyfill = globalThis.WebSocket;

if (typeof process !== 'undefined' && typeof process.versions === 'object' && process.versions.node) {
    try {
        // @ts-ignore
        const ws = require('ws');
        WebSocketPolyfill = ws.WebSocket;
    } catch (e) {
        // Игнорируем ошибку, если ws нет
    }
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
