// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://njgumqetxqdarzarpmwk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qZ3VtcWV0eHFkYXJ6YXJwbXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4MDE2ODMsImV4cCI6MjA1NDM3NzY4M30.mvlqOJGlTnd_0fTnmZ3FlC5Hf__pgLTe2wrdxe4DL78";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);