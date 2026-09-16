import { createClient } from '@supabase/supabase-js'

// أنا استخرجتلك رابط مشروعك الصحيح من الصور اللي بعثتها
const supabaseUrl = 'https://yzrlnfmofnwqsbddwudk.supabase.co'

// هون لازم تحط المفتاح تبعك
const supabaseKey = 'sb_publishable_RRbWkwa583NQZRdh0k-1Lg_zNn8mW-m'

export const supabase = createClient(supabaseUrl, supabaseKey)