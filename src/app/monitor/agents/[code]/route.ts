import { NextResponse } from 'next/server'

// Serves the agent performance HTML page for any agent code
// URL: /monitor/agents/[code] → returns HTML that calls /api/monitor/agent/[code]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Agent Performance — ${code}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  :root { --bg:#0a0f1e;--surface:#111827;--surface2:#1a2236;--border:#1f2d44;--slate:#94a3b8;--text:#e2e8f0;--emerald:#10b981;--sky:#38bdf8;--amber:#f59e0b;--rose:#f43f5e;--ac:#38BDF8;--pr:#0C0E1A; }
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;}
  .hero{padding:32px;border-bottom:1px solid var(--border);background:linear-gradient(135deg,var(--pr) 0%,#0a0f1e 60%);position:relative;overflow:hidden;}
  .hero::before{content:'';position:absolute;top:-60px;right:-60px;width:250px;height:250px;border-radius:50%;background:var(--ac);filter:blur(100px);opacity:.12;}
  .back{font-size:12px;color:var(--slate);text-decoration:none;display:inline-flex;align-items:center;gap:6px;margin-bottom:18px;}
  .back:hover{color:var(--ac);}
  .hero-main{display:flex;align-items:center;gap:20px;flex-wrap:wrap;}
  .avatar{width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid var(--ac);flex-shrink:0;}
  .avatar-fb{width:72px;height:72px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;background:color-mix(in srgb,var(--ac) 20%,transparent);border:3px solid var(--ac);color:var(--ac);flex-shrink:0;}
  .hbrand{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:4px;color:var(--ac);}
  .hname{font-size:28px;font-weight:800;color:#f8fafc;line-height:1.1;}
  .htitle{font-size:13px;color:var(--slate);margin-top:4px;}
  .live{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:20px;font-size:11px;font-weight:700;background:color-mix(in srgb,var(--ac) 12%,transparent);border:1px solid color-mix(in srgb,var(--ac) 30%,transparent);color:var(--ac);margin-left:auto;}
  .dot{width:6px;height:6px;border-radius:50%;background:currentColor;animation:pulse 2s infinite;}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
  .content{padding:24px 32px;max-width:1200px;margin:0 auto;}
  @media(max-width:640px){.content,.hero{padding:14px;}}
  .kpi-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:24px;}
  .kpi{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px 18px;position:relative;overflow:hidden;}
  .kpi::after{content:'';position:absolute;top:0;right:0;width:50px;height:50px;border-radius:50%;background:var(--ac);filter:blur(20px);opacity:.1;}
  .kpi-lbl{font-size:10px;font-weight:700;color:var(--slate);text-transform:uppercase;letter-spacing:.05em;margin-bottom:7px;}
  .kpi-val{font-size:28px;font-weight:800;color:#f8fafc;line-height:1;}
  .kpi-sub{font-size:10px;color:var(--slate);margin-top:3px;}
  .kpi-ac{color:var(--ac)!important;}
  .sec{font-size:10px;font-weight:700;color:var(--slate);text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;}
  .chart-box{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px;margin-bottom:22px;}
  .chart-title{font-size:13px;font-weight:700;color:#f8fafc;margin-bottom:14px;}
  .bars{display:flex;align-items:flex-end;gap:8px;height:80px;}
  .bcol{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;}
  .bfill{width:100%;border-radius:5px 5px 0 0;min-height:3px;transition:height .4s ease;background:color-mix(in srgb,var(--ac) 50%,transparent);}
  .bfill.today{background:var(--ac);}
  .bdate{font-size:9px;color:var(--slate);font-family:'JetBrains Mono',monospace;}
  .bcount{font-size:10px;font-weight:700;color:var(--ac);}
  .lp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;margin-bottom:24px;}
  .lp-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px;transition:border-color .2s;}
  .lp-card:hover{border-color:color-mix(in srgb,var(--ac) 40%,transparent);}
  .lp-slug{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--ac);margin-bottom:5px;}
  .lp-topic{font-size:13px;font-weight:700;color:#f8fafc;margin-bottom:10px;}
  .lp-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
  .lp-sv{font-size:20px;font-weight:800;color:#f8fafc;}
  .lp-sl{font-size:9px;color:var(--slate);text-transform:uppercase;letter-spacing:.04em;}
  .lp-link{display:inline-flex;align-items:center;gap:4px;margin-top:10px;font-size:10px;font-weight:700;text-decoration:none;padding:4px 10px;border-radius:7px;color:var(--ac);background:color-mix(in srgb,var(--ac) 12%,transparent);border:1px solid color-mix(in srgb,var(--ac) 25%,transparent);}
  .tw{background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;}
  .th{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--border);}
  .tt{font-size:13px;font-weight:700;}
  table{width:100%;border-collapse:collapse;}
  th{font-size:9px;font-weight:700;color:var(--slate);text-transform:uppercase;letter-spacing:.05em;padding:9px 16px;text-align:left;background:rgba(255,255,255,.02);}
  td{padding:9px 16px;font-size:12px;border-top:1px solid rgba(255,255,255,.04);}
  tr:hover td{background:rgba(255,255,255,.02);}
  .sp{display:inline-block;padding:2px 7px;border-radius:7px;font-size:10px;font-weight:700;}
  .sn{background:rgba(56,189,248,.15);color:var(--sky);}
  .sc{background:rgba(16,185,129,.15);color:var(--emerald);}
  .sk{background:rgba(245,158,11,.15);color:var(--amber);}
  .ta{font-family:'JetBrains Mono',monospace;color:var(--slate);}
  .empty{text-align:center;padding:32px;color:var(--slate);font-size:12px;}
</style>
</head>
<body>
<div class="hero">
  <a href="/monitor.html" class="back">← Monitor Dashboard</a>
  <div class="hero-main">
    <div id="avwrap"><div class="avatar-fb" id="avfb">?</div></div>
    <div style="flex:1">
      <div class="hbrand" id="hbrand">—</div>
      <div class="hname" id="hname">Đang tải...</div>
      <div class="htitle" id="htitle">—</div>
    </div>
    <div class="live"><div class="dot"></div>LIVE</div>
  </div>
</div>
<div class="content">
  <div class="kpi-row">
    <div class="kpi"><div class="kpi-lbl">Tổng Leads (LP)</div><div class="kpi-val" id="kt">—</div><div class="kpi-sub">landing pages mới</div></div>
    <div class="kpi"><div class="kpi-lbl">Hôm nay</div><div class="kpi-val kpi-ac" id="kd">—</div><div class="kpi-sub">leads</div></div>
    <div class="kpi"><div class="kpi-lbl">Đã chuyển đổi</div><div class="kpi-val" id="kc">—</div><div class="kpi-sub">đăng ký xong</div></div>
    <div class="kpi"><div class="kpi-lbl">Landing Pages</div><div class="kpi-val" id="kl">—</div><div class="kpi-sub">đang active</div></div>
    <div class="kpi"><div class="kpi-lbl">KB Leads (cũ)</div><div class="kpi-val" id="kk">—</div><div class="kpi-sub">via ?ref link</div></div>
  </div>
  <div class="chart-box">
    <div class="chart-title">📈 Leads 7 ngày qua</div>
    <div class="bars" id="barchart"></div>
  </div>
  <div class="sec">🔗 Landing Pages</div>
  <div class="lp-grid" id="lpgrid"><div class="empty">Đang tải...</div></div>
  <div class="sec">📩 Leads gần nhất</div>
  <div class="tw">
    <div class="th"><span class="tt">Danh sách Leads</span><span id="lcnt" style="font-size:11px;color:var(--slate)"></span></div>
    <div style="overflow-x:auto">
      <table><thead><tr><th>Họ tên</th><th>Email</th><th>SĐT</th><th>Landing Page</th><th>Trạng thái</th><th>Thời gian</th></tr></thead>
      <tbody id="ltbody"><tr><td colspan="6" class="empty">Đang tải...</td></tr></tbody></table>
    </div>
  </div>
</div>
<script>
const code='${code}';
function t(iso){const m=Math.floor((Date.now()-new Date(iso))/60000);return m<1?'vừa xong':m<60?m+'p':m<1440?Math.floor(m/60)+'h':Math.floor(m/1440)+'d';}
async function load(){
  const r=await fetch('/api/monitor/agent/'+code);
  if(!r.ok){document.body.innerHTML='<div style="padding:40px;color:#94a3b8;text-align:center">Agent không tìm thấy.</div>';return;}
  const d=await r.json();
  // Colors
  const pr=d.agent.brand_color_primary||'#0C0E1A',ac=d.agent.brand_color_accent||'#38BDF8';
  document.documentElement.style.setProperty('--pr',pr);
  document.documentElement.style.setProperty('--ac',ac);
  document.title=d.agent.brand_name+' — Performance';
  // Hero
  document.getElementById('hbrand').textContent=d.agent.brand_name||'';
  document.getElementById('hname').textContent=d.agent.full_name||'';
  document.getElementById('htitle').textContent=d.agent.title||'';
  const aw=document.getElementById('avwrap');
  if(d.agent.avatar_url){aw.innerHTML='<img src="'+d.agent.avatar_url+'" class="avatar" />';}
  else{document.getElementById('avfb').textContent=(d.agent.full_name||'?').charAt(0);}
  // KPIs
  document.getElementById('kt').textContent=d.leads_total??'—';
  document.getElementById('kd').textContent=d.leads_today??'—';
  document.getElementById('kc').textContent=d.converted??'—';
  document.getElementById('kl').textContent=(d.landing_pages||[]).length;
  document.getElementById('kk').textContent=(d.kb_leads||[]).length;
  // Bar chart
  const entries=Object.entries(d.leads_by_day||{});
  const mx=Math.max(...entries.map(e=>e[1]),1);
  const today=new Date().toISOString().slice(0,10);
  document.getElementById('barchart').innerHTML=entries.map(([day,cnt])=>{
    const h=Math.max((cnt/mx)*70,cnt>0?8:2);
    return '<div class="bcol"><div class="bcount">'+(cnt>0?cnt:'')+'</div><div class="bfill'+(day===today?' today':'') +'" style="height:'+h+'px"></div><div class="bdate">'+day.slice(5)+'</div></div>';
  }).join('');
  // LPs
  const lpMap={};(d.landing_pages||[]).forEach(l=>{lpMap[l.id]=l.slug;});
  document.getElementById('lpgrid').innerHTML=(d.landing_pages||[]).length?
    (d.landing_pages||[]).map(lp=>'<div class="lp-card"><div class="lp-slug">/lp/'+code+'/'+lp.slug+'</div><div class="lp-topic">'+(lp.topic||lp.slug)+'</div><div class="lp-stats"><div><div class="lp-sv">'+(lp.views||0)+'</div><div class="lp-sl">Lượt xem</div></div><div><div class="lp-sv">—</div><div class="lp-sl">Leads</div></div></div><a href="/lp/'+code+'/'+lp.slug+'" target="_blank" class="lp-link">🔗 Xem trang →</a></div>').join('')
    :'<div class="empty">Chưa có LP nào.</div>';
  // Leads
  const ls=d.leads||[];
  document.getElementById('lcnt').textContent=ls.length+' leads';
  document.getElementById('ltbody').innerHTML=ls.length?ls.map(l=>{
    const s=l.status||'new',pc=s==='converted'?'sc':s==='contacted'?'sk':'sn';
    const lps=l.landing_page_id?(lpMap[l.landing_page_id]||'—'):(l.utm_source||'—');
    return '<tr><td style="font-weight:600;color:#f8fafc">'+(l.full_name||'—')+'</td><td style="color:var(--slate)">'+(l.email||'—')+'</td><td style="color:var(--slate);font-family:monospace">'+(l.phone||'—')+'</td><td style="font-family:monospace;font-size:10px;color:var(--ac)">'+lps+'</td><td><span class="sp '+pc+'">'+s+'</span></td><td class="ta">'+t(l.registered_at)+'</td></tr>';
  }).join(''):'<tr><td colspan="6" class="empty">Chưa có leads.</td></tr>';
}
load();setInterval(load,60000);
</script>
</body></html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  })
}
