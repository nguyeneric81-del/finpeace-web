const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
    const { data, error } = await supabase
        .from('trading_plans')
        .select('ticker, price_series, status, updated_at')
        .in('ticker', ['FPT', 'VIX', 'SSI'])
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error querying DB:', error);
    } else {
        console.dir(data, { depth: null });
    }
}
main();
