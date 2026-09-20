const platformButtons=document.querySelectorAll(".platform");
const selectedPlatform=document.getElementById("selectedPlatform"),previewPlatform=document.getElementById("previewPlatform");
const caption=document.getElementById("caption"),media=document.getElementById("media"),previewCaption=document.getElementById("previewCaption"),previewMedia=document.getElementById("previewMedia");
const prepareButton=document.getElementById("prepareButton"),saveDraftButton=document.getElementById("saveDraftButton"),clearDraftsButton=document.getElementById("clearDraftsButton");
const message=document.getElementById("message"),charCount=document.getElementById("charCount"),mediaInfo=document.getElementById("mediaInfo"),draftList=document.getElementById("draftList"),draftCount=document.getElementById("draftCount");
const topic=document.getElementById("topic"),tagCountInput=document.getElementById("tagCountInput"),generateSeoButton=document.getElementById("generateSeoButton"),copyTagsButton=document.getElementById("copyTagsButton"),seoResult=document.getElementById("seoResult"),tagCount=document.getElementById("tagCount");
const DRAFT_KEY="social-media-tool-drafts-v1";let currentPlatform="Instagram",previewUrl=null,lastTags=[];

function getDrafts(){try{return JSON.parse(localStorage.getItem(DRAFT_KEY)||"[]")}catch{return[]}}
function setDrafts(d){localStorage.setItem(DRAFT_KEY,JSON.stringify(d))}
function formatDate(iso){return new Date(iso).toLocaleString("id-ID",{dateStyle:"short",timeStyle:"short"})}
function escapeHtml(text){const d=document.createElement("div");d.textContent=text;return d.innerHTML}
function renderDrafts(){const drafts=getDrafts();draftCount.textContent=drafts.length;if(!drafts.length){draftList.innerHTML='<div class="empty-drafts">Belum ada draft. Tekan <b>Simpan Draft</b> setelah membuat konten.</div>';return}draftList.innerHTML=drafts.map((d,i)=>'<article class="draft-item"><div class="draft-main"><span class="draft-platform">'+d.platform+'</span><div><b>'+escapeHtml(d.caption?d.caption.slice(0,90):"Tanpa caption")+'</b><small>'+formatDate(d.createdAt)+' '+(d.hasMedia?"• Media dipilih":"• Tanpa media")+'</small></div></div><div class="draft-actions"><button class="load-draft" data-index="'+i+'">Buka</button><button class="delete-draft" data-index="'+i+'">×</button></div></article>').join("")}
function selectPlatform(name){platformButtons.forEach(x=>x.classList.toggle("active",x.dataset.platform===name));currentPlatform=name;selectedPlatform.textContent=name;previewPlatform.textContent=name}
function updatePreviewText(){charCount.textContent=caption.value.length+" / 2200";previewCaption.textContent=caption.value.trim()||"Caption kamu akan muncul di sini"}
platformButtons.forEach(b=>b.addEventListener("click",()=>{selectPlatform(b.dataset.platform);message.textContent=""}));
caption.addEventListener("input",updatePreviewText);
media.addEventListener("change",()=>{const f=media.files[0];if(!f)return;if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=URL.createObjectURL(f);previewMedia.innerHTML="";const e=f.type.startsWith("video/")?document.createElement("video"):document.createElement("img");e.src=previewUrl;if(e.tagName==="VIDEO"){e.controls=true;e.muted=true}previewMedia.appendChild(e);mediaInfo.textContent="File: "+f.name+" • "+Math.round(f.size/1024)+" KB";mediaInfo.classList.remove("hidden")});

const STOP_WORDS=new Set("yang dan di ke dari untuk dengan pada adalah ini itu atau juga agar akan dalam yang nya aku kamu saya kita mereka serta bisa sudah lebih sangat ada tidak jadi karena tentang sebagai secara ketika oleh dengan buat para".split(" "));
const PLATFORM_TERMS={Instagram:["instagram","reels","instagood"],TikTok:["tiktok","fyp","viral"],YouTube:["youtube","shorts","video"],Facebook:["facebook","konten"]};
function normalizeWord(w){return w.toLowerCase().replace(/[^a-z0-9À-ÿ]/gi,"").trim()}
function makeKeywords(){const source=(topic.value+" "+caption.value).trim();const words=source.split(/\s+/).map(normalizeWord).filter(w=>w.length>=4&&!STOP_WORDS.has(w));const freq={};words.forEach(w=>freq[w]=(freq[w]||0)+1);const ranked=Object.keys(freq).sort((a,b)=>freq[b]-freq[a]||b.length-a.length);return [...new Set(ranked)].slice(0,12)}
function buildTags(){const keywords=makeKeywords();const extras=PLATFORM_TERMS[currentPlatform]||[];const tags=[];[...keywords,...extras].forEach(w=>{if(w&&!tags.includes(w))tags.push(w)});return tags.slice(0,Number(tagCountInput.value))}
function generateSEO(){if(!caption.value.trim()&&!topic.value.trim()){seoResult.innerHTML='<div class="seo-empty">Isi caption atau topik terlebih dahulu.</div>';return}lastTags=buildTags();tagCount.textContent=lastTags.length;const keywordText=makeKeywords().slice(0,8);seoResult.innerHTML='<div class="seo-block"><b>Hashtag yang disarankan</b><div class="tag-cloud">'+lastTags.map(t=>'<span>#'+escapeHtml(t)+'</span>').join("")+'</div></div><div class="seo-block"><b>Kata kunci terdeteksi</b><p>'+keywordText.map(escapeHtml).join(" • ")+'</p></div><div class="seo-note">Catatan: ini generator berbasis teks lokal, bukan jaminan peringkat atau jangkauan. Periksa relevansi tag sebelum dipakai.</div>'}
generateSeoButton.addEventListener("click",generateSEO);
copyTagsButton.addEventListener("click",async()=>{if(!lastTags.length)generateSEO();if(!lastTags.length)return;try{await navigator.clipboard.writeText(lastTags.map(x=>"#"+x).join(" "));message.textContent="✓ Hashtag berhasil disalin."}catch{message.textContent="Salin manual dari kotak hashtag."}});
saveDraftButton.addEventListener("click",()=>{const text=caption.value.trim();if(!text&&!media.files.length){message.textContent="Isi caption atau pilih media sebelum menyimpan draft.";return}const d=getDrafts();d.unshift({id:Date.now(),platform:currentPlatform,caption:text,hasMedia:media.files.length>0,mediaName:media.files[0]?.name||"",createdAt:new Date().toISOString(),tags:lastTags});setDrafts(d.slice(0,20));renderDrafts();message.textContent="✓ Draft tersimpan di perangkat ini."});
draftList.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const i=Number(b.dataset.index),d=getDrafts();if(b.classList.contains("load-draft")){const x=d[i];selectPlatform(x.platform);caption.value=x.caption||"";lastTags=x.tags||[];updatePreviewText();if(lastTags.length){tagCount.textContent=lastTags.length;seoResult.innerHTML='<div class="seo-block"><b>Hashtag tersimpan</b><div class="tag-cloud">'+lastTags.map(t=>"<span>#"+escapeHtml(t)+"</span>").join("")+"</div></div>'}message.textContent=x.hasMedia?"✓ Draft dibuka. Pilih kembali file medianya untuk preview.":"✓ Draft dibuka."}if(b.classList.contains("delete-draft")){d.splice(i,1);setDrafts(d);renderDrafts();message.textContent="Draft dihapus."}});
clearDraftsButton.addEventListener("click",()=>{if(!getDrafts().length)return;localStorage.removeItem(DRAFT_KEY);renderDrafts();message.textContent="Semua draft dihapus."});
prepareButton.addEventListener("click",()=>{if(!caption.value.trim()&&!media.files.length){message.textContent="Isi caption atau tambahkan media terlebih dahulu.";return}message.textContent="✓ Postingan "+currentPlatform+" sudah disiapkan. Pengiriman asli belum aktif."});
renderDrafts();
const seoAudience=document.getElementById("seoAudience"),seoTone=document.getElementById("seoTone"),smartSeoButton=document.getElementById("smartSeoButton"),copySeoButton=document.getElementById("copySeoButton"),smartSeoResult=document.getElementById("smartSeoResult");
function smartSEO(){
  const base=(topic.value.trim()||makeKeywords().slice(0,3).join(" ")).trim();
  const audience=seoAudience.value.trim()||"audiens yang tertarik dengan topik ini";
  if(!base&&!caption.value.trim()){smartSeoResult.innerHTML='<div class="seo-empty">Isi caption atau topik terlebih dahulu.</div>';return}
  const kws=makeKeywords().slice(0,8); const main=(topic.value.trim()||kws[0]||"konten").trim();
  const titleBase=main.charAt(0).toUpperCase()+main.slice(1);
  const hooks={
    natural:"Sedikit cerita tentang "+main+" yang mungkin kamu butuhkan.",
    friendly:"Kalau kamu suka "+main+", ini wajib kamu simak!",
    professional:"Panduan singkat dan praktis tentang "+main+".",
    viral:"STOP scroll! Ini yang perlu kamu tahu tentang "+main+" 🔥"
  };
  const hook=hooks[seoTone.value]||hooks.natural;
  const cta=seoTone.value==="professional"?"Simpan postingan ini dan bagikan kepada orang yang membutuhkannya.":seoTone.value==="viral"?"Tag temanmu yang wajib lihat ini! 👇":"Setuju? Tulis pendapatmu di komentar 👇";
  const description="Konten tentang "+main+" untuk "+audience+". "+(caption.value.trim()?caption.value.trim().slice(0,180):"Temukan poin penting dan inspirasi yang bisa kamu gunakan.");
  const tags=buildTags();
  const title=titleBase+" | "+(kws.slice(0,2).join(" & ")||"Tips");
  const all="HOOK: "+hook+"\n\nJUDUL: "+title+"\n\nDESKRIPSI: "+description+"\n\nKEYWORD: "+kws.join(", ")+"\n\nHASHTAG: "+tags.map(t=>"#"+t).join(" ")+"\n\nCTA: "+cta;
  smartSeoResult.innerHTML='<div class="smart-block"><span class="smart-label">HOOK</span><p>'+escapeHtml(hook)+'</p></div><div class="smart-block"><span class="smart-label">SEO TITLE</span><p>'+escapeHtml(title)+'</p></div><div class="smart-block"><span class="smart-label">SEO DESCRIPTION</span><p>'+escapeHtml(description)+'</p></div><div class="smart-block"><span class="smart-label">KEYWORDS</span><p>'+kws.map(escapeHtml).join(" • ")+'</p></div><div class="smart-block"><span class="smart-label">HASHTAGS</span><div class="tag-cloud">'+tags.map(t=>"<span>#"+escapeHtml(t)+"</span>").join("")+'</div></div><div class="smart-block"><span class="smart-label">CTA</span><p>'+escapeHtml(cta)+'</p></div><div class="seo-note">Generator ini berjalan di browser tanpa API. Hasilnya adalah saran berbasis teks, bukan jaminan ranking atau viral.</div>';
  window.currentSEOText=all;
}
smartSeoButton.addEventListener("click",smartSEO);
copySeoButton.addEventListener("click",async()=>{if(!window.currentSEOText)smartSEO();if(!window.currentSEOText)return;try{await navigator.clipboard.writeText(window.currentSEOText);message.textContent="✓ Paket SEO berhasil disalin."}catch{message.textContent="Paket SEO sudah dibuat; salin manual dari hasil."}});
