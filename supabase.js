<script type="module">
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const SUPABASE_URL = "https://nkcctncsjmcfsiguowms.supabase.co"
const SUPABASE_KEY = "sb_publishable_CY2GLPbRJRDcRAyPXzOD4Q_63uR5W9X"

window.supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

console.log("Supabase READY", window.supabase)
</script>
