const $=id=>document.getElementById(id);
let trades=JSON.parse(localStorage.getItem('traderProTrades')||'[]');
let lang=localStorage.getItem('traderProLang')||'en';
const words={
en:{subtitle:'PERSONAL TRADING JOURNAL',overview:'YOUR PERFORMANCE',dashboard:'Dashboard',local:'Private • Saved on this device',addTrade:'Add Trade',net:'Net P/L',winRate:'Win rate',trades:'Total trades',avg:'Average P/L',recorded:'Recorded trades',perTrade:'Per trade',journal:'JOURNAL',history:'Trade history',export:'Export CSV',emptyTitle:'No trades yet',emptyText:'Add your first trade to start tracking performance.',addFirst:'＋ Add your first trade',date:'DATE',market:'MARKET',pair:'SYMBOL',side:'SIDE',result:'RESULT',newEntry:'NEW ENTRY',symbol:'Symbol',entry:'Entry price',exit:'Exit price',profit:'Profit / Loss ($)',risk:'Risk ($)',notes:'Notes / Strategy',pnlHint:'Enter your realized P/L manually. Positive = profit, negative = loss.',cancel:'Cancel',saveTrade:'Save Trade',privacy:'Your journal is stored locally on this device. Clearing browser data may erase it.',all:'All markets',buy:'Buy',sell:'Sell',delete:'Delete this trade?',saved:'Trade saved.'},
bn:{subtitle:'ব্যক্তিগত ট্রেডিং জার্নাল',overview:'আপনার পারফরম্যান্স',dashboard:'ড্যাশবোর্ড',local:'ব্যক্তিগত • এই ডিভাইসে সংরক্ষিত',addTrade:'ট্রেড যোগ করুন',net:'মোট লাভ/ক্ষতি',winRate:'উইন রেট',trades:'মোট ট্রেড',avg:'গড় লাভ/ক্ষতি',recorded:'সংরক্ষিত ট্রেড',perTrade:'প্রতি ট্রেড',journal:'জার্নাল',history:'ট্রেডের ইতিহাস',export:'CSV ডাউনলোড',emptyTitle:'এখনো কোনো ট্রেড নেই',emptyText:'পারফরম্যান্স ট্র্যাক করতে প্রথম ট্রেড যোগ করুন।',addFirst:'＋ প্রথম ট্রেড যোগ করুন',date:'তারিখ',market:'মার্কেট',pair:'সিম্বল',side:'ধরন',result:'ফলাফল',newEntry:'নতুন এন্ট্রি',symbol:'সিম্বল',entry:'এন্ট্রি প্রাইস',exit:'এক্সিট প্রাইস',profit:'লাভ / ক্ষতি ($)',risk:'রিস্ক ($)',notes:'নোট / কৌশল',pnlHint:'বাস্তব লাভ/ক্ষতি লিখুন। ধনাত্মক = লাভ, ঋণাত্মক = ক্ষতি।',cancel:'বাতিল',saveTrade:'ট্রেড সেভ করুন',privacy:'আপনার জার্নাল এই ডিভাইসে সংরক্ষিত। ব্রাউজারের ডেটা মুছলে তথ্য হারাতে পারে।',all:'সব মার্কেট',buy:'Buy',sell:'Sell',delete:'এই ট্রেডটি মুছবেন?',saved:'ট্রেড সেভ হয়েছে।'}
};
function t(k){return words[lang][k]||k}
function money(n){return (n<0?'-$':'$')+Math.abs(n).toFixed(2)}
function persist(){localStorage.setItem('traderProTrades',JSON.stringify(trades));render()}
function render(){
 const total=trades.length,wins=trades.filter(x=>x.pnl>0).length,loss=trades.filter(x=>x.pnl<0).length,net=trades.reduce((s,x)=>s+x.pnl,0),avg=total?net/total:0;
 $('net').textContent=money(net);$('net').className=net>0?'positive':net<0?'negative':'';
 $('winRate').textContent=(total?wins/total*100:0).toFixed(1)+'%';$('winLoss').textContent=`${wins}W / ${loss}L`;
 $('total').textContent=total;$('avg').textContent=money(avg);$('avg').className=avg>0?'positive':avg<0?'negative':'';
 const filter=$('marketFilter').value;const shown=trades.filter(x=>filter==='All'||x.market===filter).sort((a,b)=>b.date.localeCompare(a.date));
 $('empty').style.display=shown.length?'none':'block';$('emptyAdd').textContent=t('addFirst');
 $('tradeRows').innerHTML=shown.map(x=>`<tr><td>${escapeHtml(x.date)}</td><td><span class="pill">${escapeHtml(x.market)}</span></td><td class="symbol">${escapeHtml(x.symbol.toUpperCase())}</td><td>${x.side==='Buy'?t('buy'):t('sell')}</td><td class="${x.pnl>0?'positive':x.pnl<0?'negative':''}">${money(x.pnl)}</td><td><button class="delete" data-id="${x.id}" title="Delete">×</button></td></tr>`).join('');
 document.querySelectorAll('.delete').forEach(b=>b.onclick=()=>{if(confirm(t('delete'))){trades=trades.filter(x=>x.id!==b.dataset.id);persist()}});
 document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(words[lang][k])el.textContent=t(k)});
 $('langBtn').textContent=lang==='en'?'বাংলা':'English';document.documentElement.lang=lang;
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function openDialog(){$('date').value=new Date().toISOString().slice(0,10);$('tradeDialog').showModal()}
$('addBtn').onclick=openDialog;$('emptyAdd').onclick=openDialog;$('closeDialog').onclick=()=>$('tradeDialog').close();$('cancelBtn').onclick=()=>$('tradeDialog').close();$('marketFilter').onchange=render;
$('langBtn').onclick=()=>{lang=lang==='en'?'bn':'en';localStorage.setItem('traderProLang',lang);render()};
$('tradeForm').onsubmit=e=>{e.preventDefault();const pnl=Number($('pnl').value);if(!Number.isFinite(pnl))return;trades.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),date:$('date').value,market:$('market').value,symbol:$('symbol').value.trim(),side:$('side').value,entry:$('entry').value,exit:$('exit').value,pnl,risk:Number($('risk').value)||0,notes:$('notes').value});persist();$('tradeForm').reset();$('tradeDialog').close()};
$('exportBtn').onclick=()=>{const cols=['date','market','symbol','side','entry','exit','pnl','risk','notes'];const csv=[cols.join(','),...trades.map(x=>cols.map(k=>'"'+String(x[k]??'').replace(/"/g,'""')+'"').join(','))].join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='trader-pro-journal.csv';a.click();URL.revokeObjectURL(a.href)};
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
render();