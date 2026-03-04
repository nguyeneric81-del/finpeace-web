const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    const { data, error } = await supabase
        .from('trading_plans')
        .select('ticker, strategy_name, analyst_note')
        .limit(10);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Trading Plans Sample:');
    console.table(data);
}

checkData();
