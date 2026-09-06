/* GitHub Pages demo bridge. Production sites require authenticated server APIs. */
globalThis.TeleproCaseLink = (() => {
  const resultKey='telepro-case-results-v1', hubKey='telepro-unified-collaboration-records-v1';
  function read(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}}
  function results(){const value=read(resultKey,{});return value && typeof value==='object' && !Array.isArray(value)?value:{};}
  function merge(record){const saved=results()[record.id];if(!saved)return record;return {...record,...(Object.hasOwn(saved,'outcome')?{outcome:saved.outcome}:{}),...(saved.highlights?{highlights:saved.highlights}:{})};}
  function save(id,patch){const all=results();all[id]={...all[id],...patch,updatedAt:new Date().toISOString()};localStorage.setItem(resultKey,JSON.stringify(all));}
  function parse(hash){const match=/^#\/cases\/([A-Za-z0-9_-]+)\/(highlights|outcome)$/.exec(hash);return match?{id:match[1],view:match[2]}:null;}
  function path(id,view='highlights'){if(!/^[A-Za-z0-9_-]+$/.test(id)||!['highlights','outcome'].includes(view))return '';return `#/cases/${id}/${view}`;}
  function destination(site,id,view='highlights'){const local=['localhost','127.0.0.1'].includes(location.hostname);const base=local?`${location.origin}/${site}/`:`https://yukohara2501.github.io/${site}/`;return base+path(id,view);}
  function catalogue(seeds){const stored=read(hubKey,[]);const source=Array.isArray(stored)?stored:[];const known=new Map(seeds.map(r=>[r.id,r]));for(const r of source){if(r?.type==='keio'&&r.completed)known.set(r.id,{...known.get(r.id),...r});}return [...known.values()].map(merge);}
  return {resultKey,hubKey,read,merge,save,parse,path,destination,catalogue};
})();
