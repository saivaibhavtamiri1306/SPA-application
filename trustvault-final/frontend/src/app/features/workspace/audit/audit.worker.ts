const hex = (bytes: Uint8Array) => [...bytes].map(x => x.toString(16).padStart(2, '0')).join('');
self.onmessage = async (event: MessageEvent<string[]>) => {
  const enc = new TextEncoder(); let prev = '0'.repeat(64); const hashes:string[]=[]; const t0=performance.now();
  for (let i=0;i<event.data.length;i++) { const digest=await crypto.subtle.digest('SHA-256',enc.encode(prev+event.data[i])); prev=hex(new Uint8Array(digest)); hashes.push(prev); if(i%500===0) self.postMessage({type:'progress',pct:Math.round(i/event.data.length*100)}); }
  self.postMessage({type:'done',hashes,ms:Math.round(performance.now()-t0)});
};
