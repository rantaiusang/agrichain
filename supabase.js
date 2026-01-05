<script type="module">
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const SUPABASE_URL = "https://xxxx.supabase.co"
const SUPABASE_KEY = "sb_publishable_xxxxx"

window.supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
</script>
