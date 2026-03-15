import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://idtexwsdjhqkrocjbbor.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkdGV4d3Nkamhxa3JvY2piYm9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NzY5NjAsImV4cCI6MjA4OTE1Mjk2MH0.Aitt2a--8sFS-0hV8jWBLjklK6U04IewTnNUGDNRPqs';

export const supabase = createClient(supabaseUrl, supabaseKey);
