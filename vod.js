(()=>{
const root=document.getElementById('tp-vod');
const $=s=>root.querySelector(s);

const link=TeleproCaseLink;
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const videos=link.catalogue(TELEPRO_DEMO_CASES).map((r,i)=>({...r,recordId:r.id,id:r.caseId||r.id,seconds:r.seconds||0,duration:[Math.floor((r.seconds||0)/3600),Math.floor((r.seconds||0)/60)%60,(r.seconds||0)%60].map(x=>String(x).padStart(2,'0')).join(':'),thumb:i%2?'b':'',state:r.highlights?'saved':'ready'}));
const templates=[{"title":"術野の確認についての対話","start":740,"end":850,"speech":762,"quote":"術者：この境界を確認していますが、奥側が見えにくいです。\n指導者：操作を進める前に、見えている範囲を教えてください。\n術者：手前の境界は見えています。奥側をもう一度確認します。"},{"title":"予定と実際の違いについての相談","start":2500,"end":2630,"speech":2523,"quote":"術者：予定した進め方では、ここから先が難しそうです。\n指導者：どこが予定と違っていますか。\n術者：想定より視野が狭く、同じ方向から続けにくいです。\n指導者：では、今の状況を一緒に確認しましょう。"},{"title":"操作の意図についての確認","start":4330,"end":4470,"speech":4364,"quote":"指導者：今、手を止めたのは何を確認するためですか。\n術者：次の操作に進む前に、周囲との位置関係を確認するためです。\n指導者：どこまで確認できましたか。\n術者：手前は確認できました。奥側はまだ確認中です。"}];
let active=0,selected=0;const jobs={};const opts={accent:'#954494',entry:'label'};
const clock=n=>[Math.floor(n/3600),Math.floor(n/60)%60,n%60].map(v=>String(v).padStart(2,'0')).join(':');
const parse=s=>{if(!/^\d{2}:\d{2}:\d{2}$/.test(s))return NaN;const a=s.split(':').map(Number);return a[1]<60&&a[2]<60?a[0]*3600+a[1]*60+a[2]:NaN;};
function getClips(index){if(!jobs[index] && videos[index].highlights?.clips?.length)jobs[index]=structuredClone(videos[index].highlights.clips);if(!jobs[index]){const factor=Math.min(1,videos[index].seconds/4800);jobs[index]=templates.map(x=>({...x,start:Math.floor(x.start*factor),end:Math.floor(x.end*factor),speech:Math.floor(x.speech*factor),included:true}));}return jobs[index].map(c=>{c.source ||= 'ai';c.transcript ??= c.quote||'';return c;});}
function drawLibrary(){const query=$('#tp-ref').value.trim();const items=videos.map((v,i)=>({v,i})).filter(({v})=>v.seconds>0&&(!query||[v.id,v.procedure,v.requester].join(' ').includes(query)));$('#tp-count').textContent=items.length+'件の動画';$('#tp-grid').innerHTML=items.map(({v,i})=>`<article class="tp-card"><div class="tp-thumb ${v.thumb}" role="img" aria-label="デモ動画のプレースホルダー"><span class="tp-duration">${v.duration}</span></div><h3>${escape(v.procedure)}</h3><p class="tp-case-id">${escape(v.id)}</p><dl class="tp-meta"><dt>YDT</dt><dd>${escape(v.date)}</dd><dt>Owner</dt><dd>${escape(v.requester)}</dd><dt>Room</dt><dd>${escape(v.from)}</dd><dt>Category</dt><dd>LOCAL REC</dd><dt>Access</dt><dd>Demo</dd></dl><div class="tp-action"><span class="tp-tag">${v.state==='saved'?'ハイライト保存済み':v.state==='ready'?'候補 3場面':v.state==='processing'?'候補を作成中':'音声付き'}</span><button class="tp-btn tp-open ${opts.entry==='label'?'tp-primary':''}" data-open="${i}">${v.state==='saved'?'ハイライトを開く':v.state==='ready'?'候補を確認':v.state==='processing'?'処理状況':'ハイライト作成'}</button></div></article>`).join('')||'<p class="tp-empty">該当する動画がありません</p>';}
function totals(){const c=getClips(active).filter(x=>x.included);const duration=c.reduce((n,x)=>n+x.end-x.start,0);$('#tp-total').textContent=c.length+'場面を選択 · 合計 '+Math.floor(duration/60)+'分'+String(duration%60).padStart(2,'0')+'秒';$('#tp-save').disabled=!c.length;}
function renderTranscript(value){
  $('#tp-quote').innerHTML=value?value.split('\n').map(line=>{
    const match=/^(術者|指導者|話者不明)[：:]\s*(.*)$/.exec(line);
    return match?`<span class="tp-dialogue-line"><strong class="tp-speaker ${match[1]==='術者'?'operator':match[1]==='指導者'?'instructor':'unknown'}">${escape(match[1])}</strong><span>${escape(match[2])}</span></span>`:`<span class="tp-dialogue-line">${escape(line)}</span>`;
  }).join(''):'書き起こしは未入力です。';
}
function drawEditor(){
  const clips=getClips(active);
  $('#tp-clips').innerHTML=clips.map((c,i)=>`<div class="tp-clip ${i===selected?'selected':''}">
    <div class="tp-cliptop"><input type="checkbox" data-include="${i}" aria-label="${escape(c.title)}をハイライトに含める" ${c.included?'checked':''}>
    <button class="tp-clipchoose" data-select="${i}" aria-pressed="${i===selected}">${escape(c.title)}<small>${clock(c.start)} — ${clock(c.end)}</small></button>
    <span class="tp-source ${c.source==='manual'?'manual':''}">${c.source==='manual'?'手動追加':'AI候補'}</span></div>
    ${i===selected?`<div class="tp-trim"><div class="tp-trimfields"><label>開始<input type="text" data-bound="start" value="${clock(c.start)}" aria-label="切り出し開始時刻"></label><label>終了<input type="text" data-bound="end" value="${clock(c.end)}" aria-label="切り出し終了時刻"></label></div>
    <div class="tp-nudge"><button data-nudge="start">開始を10秒前へ</button><button data-nudge="end">終了を10秒後へ</button></div>
    <label class="tp-transcript-label">この区間の書き起こし<textarea data-transcript="${i}" rows="6" placeholder="この区間の発話を入力・修正できます。">${escape(c.transcript)}</textarea></label>
    <p class="tp-transcript-note">${c.source==='manual'?'デモでは音声の自動書き起こしは未接続です。入力した内容を区間と一緒に保存できます。':'会話内容に基づく話者表示のサンプルです。役割名もこの欄で修正できます。'}</p></div>`:''}</div>`).join('');
  const c=clips[selected];
  renderTranscript(c.transcript);
  $('#tp-quote-time').textContent=clock(c.start)+' — '+clock(c.end)+(c.source==='manual'?' · 手動追加':' · AI候補（サンプル）');
  $('#tp-preview-time').textContent=clock(c.start)+' — '+clock(c.end);$('#tp-preview-image').className='tp-thumb '+videos[active].thumb;
  $('#tp-full-duration').textContent=videos[active].duration;$('#tp-endtime').textContent=clock(videos[active].seconds);
  $('#tp-timeline').innerHTML=clips.map((x,i)=>`<button class="tp-mark ${x.source==='manual'?'manual':''} ${i===selected?'on':''}" data-select="${i}" style="left:${x.start/videos[active].seconds*100}%;width:${(x.end-x.start)/videos[active].seconds*100}%" aria-label="${escape(x.title)} ${clock(x.start)}"></button>`).join('');totals();
}
function createManualClip(title,start,end,duration){
  const from=parse(start.trim()),to=parse(end.trim());
  if(!Number.isFinite(from)||!Number.isFinite(to)||from<0||from>=to||to>duration)throw new Error('元動画の範囲内で、開始より後の終了時刻を「00:00:00」の形式で入力してください。');
  return {title:title.trim()||'追加した区間',start:from,end:to,source:'manual',transcript:'',included:true};
}
function closeAddForm(){ $('#tp-add-form').hidden=true;$('#tp-add-toggle').setAttribute('aria-expanded','false'); }
$('#tp-add-toggle').onclick=()=>{
  const form=$('#tp-add-form');if(!form.hidden){closeAddForm();return;}
  form.reset();$('#tp-add-error').hidden=true;form.hidden=false;$('#tp-add-toggle').setAttribute('aria-expanded','true');$('#tp-add-start').focus();
};
$('#tp-add-cancel').onclick=closeAddForm;
$('#tp-add-form').addEventListener('submit',e=>{
  e.preventDefault();
  try{
    const c=createManualClip($('#tp-add-title').value,$('#tp-add-start').value,$('#tp-add-end').value,videos[active].seconds);
    getClips(active);jobs[active].push(c);selected=jobs[active].length-1;closeAddForm();drawEditor();
    $('#tp-save-status').textContent='区間を追加しました。「ハイライトを保存」で確定します。';$('[data-transcript="'+selected+'"]').focus();
  }catch(err){$('#tp-add-error').textContent=err.message;$('#tp-add-error').hidden=false;}
});
root.addEventListener('input',e=>{
  if(e.target.dataset.transcript===undefined)return;
  const c=getClips(active)[Number(e.target.dataset.transcript)];c.transcript=e.target.value;
  renderTranscript(c.transcript);$('#tp-save-status').textContent='未保存の変更があります。';
});

function showReady(){ $('#tp-progress').hidden=true;$('#tp-ready').hidden=false;drawEditor();}
function open(index,view='highlights'){
  active=index;selected=0;closeAddForm();const v=videos[index];
  $('#tp-library').hidden=true;$('#tp-route-error').hidden=true;$('#tp-work').hidden=false;
  $('#tp-breadcrumb').textContent='⌂ TOP › VOD › '+v.id+' › ハイライト・Outcome';
  $('#tp-source-title').textContent=v.procedure+' · '+v.id+(v.seconds?' · 元動画 '+v.duration:' · 録画なし');
  $('#tp-hub-back').href=link.destination('telepro-collaboration-hub',v.recordId,'outcome');
  $('#tp-error').hidden=true;$('#tp-progress').hidden=true;$('#tp-ready').hidden=false;
  $('.tp-highlight-column').hidden=!v.seconds;$('.tp-case-layout').classList.toggle('outcome-only',!v.seconds);
  if(v.seconds)drawEditor();
  fillOutcome(v);$('#tp-save-status').textContent='';
  if(view==='outcome')$('#tp-outcome-panel').scrollIntoView({block:'nearest'});
}
function fillOutcome(v){
  const o=link.merge({...v,id:v.recordId}).outcome||{};
  for(const key of ['minutes','bloodLoss','stay','intra','post','term','grade'])$('#tp-'+key).value=o[key]??(key==='term'?'術後出血':key==='grade'?'I':'');
  $('#tp-complications').hidden=$('#tp-post').value!=='present';$('#tp-outcome-status').textContent='';
}
function applyRoute(){
  const route=link.parse(location.hash);
  if(!location.hash || location.hash==='#'){back();return;}
  const index=route?videos.findIndex(v=>v.recordId===route.id):-1;
  if(index<0){$('#tp-library').hidden=true;$('#tp-work').hidden=true;$('#tp-route-error').hidden=false;return;}
  open(index,route.view);
}
root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.open!==undefined)location.hash=link.path(videos[Number(b.dataset.open)].recordId);if(b.dataset.select!==undefined){selected=Number(b.dataset.select);$('#tp-error').hidden=true;drawEditor();}if(b.dataset.nudge){$('#tp-error').hidden=true;const c=getClips(active)[selected];if(b.dataset.nudge==='start')c.start=Math.max(0,c.start-10);else c.end=Math.min(videos[active].seconds,c.end+10);drawEditor();}});
root.addEventListener('change',e=>{const el=e.target;if(el.dataset.include!==undefined){getClips(active)[Number(el.dataset.include)].included=el.checked;totals();}if(el.dataset.bound){const c=getClips(active)[selected],val=parse(el.value),proposed={...c,[el.dataset.bound]:val};if(!Number.isFinite(val)||proposed.start<0||proposed.end>videos[active].seconds||proposed.start>=proposed.end){$('#tp-error').hidden=false;$('#tp-error').textContent='元動画の範囲内で、開始より後の終了時刻を入力してください。';el.value=clock(c[el.dataset.bound]);}else{c[el.dataset.bound]=val;$('#tp-error').hidden=true;drawEditor();}}});
function back(){ $('#tp-work').hidden=true;$('#tp-route-error').hidden=true;$('#tp-library').hidden=false;$('#tp-breadcrumb').textContent='⌂ TOP › VOD';drawLibrary();}
$('#tp-back').onclick=()=>{location.hash='';};
$('#tp-search').onclick=drawLibrary;
$('#tp-ref').addEventListener('input',drawLibrary);
$('#tp-clear').onclick=()=>{$('#tp-ref').value='';root.querySelectorAll('.tp-side input[type=date]').forEach(x=>x.value='');root.querySelectorAll('.tp-side select').forEach(x=>x.selectedIndex=0);drawLibrary();};
$('#tp-save').onclick=()=>{
  const v=videos[active],highlights={recordingId:v.recordId+'-vod-1',clips:structuredClone(getClips(active)),savedAt:new Date().toISOString()};
  try{link.save(v.recordId,{highlights});v.highlights=highlights;v.state='saved';$('#tp-save-status').textContent='区間と書き起こしを保存しました。';}
  catch{$('#tp-save-status').textContent='保存できませんでした。ブラウザの保存領域を確認してください。';}
};
$('#tp-post').addEventListener('change',()=>{$('#tp-complications').hidden=$('#tp-post').value!=='present';});
$('#tp-outcome-form').addEventListener('submit',e=>{
  e.preventDefault();const outcome={};for(const key of ['minutes','bloodLoss','stay','intra','post','term','grade'])outcome[key]=$('#tp-'+key).value;
  if(outcome.post!=='present'){outcome.term='';outcome.grade='';}
  try{link.save(videos[active].recordId,{outcome});videos[active].outcome=outcome;$('#tp-outcome-status').textContent='Outcomeを保存しました。Hubの同じCaseの結果履歴にも反映されます（同一ブラウザのデモ）。';}
  catch{$('#tp-outcome-status').textContent='保存できませんでした。ブラウザの保存領域を確認してください。';}
});
window.addEventListener('hashchange',applyRoute);
function design(){root.style.setProperty('--tp-accent',opts.accent);drawLibrary();}design();applyRoute();
if(globalThis.lucide) lucide.createIcons({attrs:{width:20,height:20}});
})();
