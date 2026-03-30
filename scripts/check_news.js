require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const today = new Date().toISOString().split('T')[0];
  const { data } = await sb.from('raw_news')
    .select('id, title, source, category, relevance, status, published_at, crawl_date')
    .gte('crawl_date', today)
    .order('relevance', { ascending: false })
    .order('published_at', { ascending: false });

  console.log('=== Tin hom nay (' + today + ') ===');
  console.log('Tong:', (data || []).length, 'tin');

  (data || []).forEach(function (n, i) {
    var rel = n.relevance === 3 ? '***' : n.relevance === 2 ? '**' : '*';
    var st = n.status === 'approved' ? '[V]' : n.status === 'ignored' ? '[X]' : '[?]';
    console.log((i + 1) + '. ' + rel + ' ' + st + ' [' + (n.source || '-') + '] ' + (n.category || '') + ' - ' + n.title);
  });

  if (!data || data.length === 0) {
    var r = await sb.from('raw_news')
      .select('crawl_date, title, source, category, relevance, status')
      .order('crawl_date', { ascending: false })
      .limit(15);
    var latest = r.data;
    console.log('\n=== Tin moi nhat (crawl_date: ' + (latest && latest[0] ? latest[0].crawl_date : 'N/A') + ') ===');
    (latest || []).forEach(function (n, i) {
      var rel = n.relevance === 3 ? '***' : n.relevance === 2 ? '**' : '*';
      var st = n.status === 'approved' ? '[V]' : n.status === 'ignored' ? '[X]' : '[?]';
      console.log((i + 1) + '. ' + rel + ' ' + st + ' [' + (n.source || '-') + '] ' + (n.category || '') + ' - ' + n.title);
    });
  }
})();
