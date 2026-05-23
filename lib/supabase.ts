import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mmmsruuonlastzdbtvza.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tbXNydXVvbmxhc3R6ZGJ0dnphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMDk5ODksImV4cCI6MjA5NDY4NTk4OX0.Xsn-a8_NCqm9ynvS5uSlQw9Qmxf-NFf422vDLH2D_Gc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);