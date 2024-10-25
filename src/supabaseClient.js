import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lvktjgldcfgmklmgbstx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2a3RqZ2xkY2ZnbWtsbWdic3R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk4NjA5MTUsImV4cCI6MjA0NTQzNjkxNX0.3zn9sr1n5mz2QE3FxWeBkq4XnEhPHroGkOU5C26I5uc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
