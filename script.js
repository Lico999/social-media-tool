const platformButtons=document.querySelectorAll(".platform");
const selectedPlatform=document.getElementById("selectedPlatform");
const previewPlatform=document.getElementById("previewPlatform");
const caption=document.getElementById("caption");
const media=document.getElementById("media");
const previewCaption=document.getElementById("previewCaption");
const previewMedia=document.getElementById("previewMedia");
const prepareButton=document.getElementById("prepareButton");
const saveDraftButton=document.getElementById("saveDraftButton");
const clearDraftsButton=document.getElementById("clearDraftsButton");
const message=document.getElementById("message");
const charCount=document.getElementById("charCount");
const mediaInfo=document.getElementById("mediaInfo");
const draftList=document.getElementById("draftList");
const draftCount=document.getElementById("draftCount");
const DRAFT_KEY="social-media-tool-drafts-v1";
let currentPlatform="Instagram";
let previewUrl=null;

function getDrafts(){try{return JSON.parse(localStorage.getItem(DRAFT_KEY)||"[]")}catch{return[]}}
function setDrafts(drafts){localStorage.setItem(DRAFT_KEY,JSON.stringify(drafts))}
function formatDate(iso){return new Date(iso).toLocaleString("id-ID",{dateStyle:"short",timeStyle:"short"})}
function renderDrafts(){
  const drafts=getDrafts();
  draftCount.textContent=drafts.length;
  if(!drafts.length){draftList.innerHTML='<div class="empty-drafts">Belum ada draft. Tekan <b>Simpan Draft</b> setelah membuat konten.</div>';return}
  draftList.innerHTML=drafts.map((d,i)=>`
    <article class="draft-item">
      <div class="draft-main"><span class="draft-platform">${d.platform}</span><div><b>${d.caption?escapeHtml(d.caption.slice(0,90)):"Tanpa caption"}</b><small>${formatDate(d.createdAt)} ${d.hasMedia?"• Media dipilih":"• Tanpa media"}</small></div></div>
      <div class="draft-actions"><button class="load-draft" data-index="${i}">Buka</button><button class="delete-draft" data-index="${i}" aria-label="Hapus draft">×</button></div>
    </article>`).join("");
}
function escapeHtml(text){const div=document.createElement("div");div.textContent=text;return div.innerHTML}
function selectPlatform(name){
  platformButtons.forEach(item=>item.classList.toggle("active",item.dataset.platform===name));
  currentPlatform=name;selectedPlatform.textContent=name;previewPlatform.textContent=name;
}
function updatePreviewText(){charCount.textContent=`${caption.value.length} / 2200`;previewCaption.textContent=caption.value.trim()||"Caption kamu akan muncul di sini..."}
platformButtons.forEach(button=>button.addEventListener("click",()=>{selectPlatform(button.dataset.platform);message.textContent=""}));
caption.addEventListener("input",updatePreviewText);

media.addEventListener("change",()=>{
  const file=media.files[0];if(!file)return;
  if(previewUrl)URL.revokeObjectURL(previewUrl);
  previewUrl=URL.createObjectURL(file);previewMedia.innerHTML="";
  const element=file.type.startsWith("video/")?document.createElement("video"):document.createElement("img");
  element.src=previewUrl;if(element.tagName==="VIDEO"){element.controls=true;element.muted=true}
  previewMedia.appendChild(element);
  mediaInfo.textContent=`File: ${file.name} • ${Math.round(file.size/1024)} KB`;
  mediaInfo.classList.remove("hidden");
});

saveDraftButton.addEventListener("click",()=>{
  const text=caption.value.trim();
  if(!text && !media.files.length){message.textContent="Isi caption atau pilih media sebelum menyimpan draft.";return}
  const drafts=getDrafts();
  drafts.unshift({id:Date.now(),platform:currentPlatform,caption:text,hasMedia:media.files.length>0,mediaName:media.files[0]?.name||"",createdAt:new Date().toISOString()});
  setDrafts(drafts.slice(0,20));renderDrafts();
  message.textContent="✓ Draft tersimpan di perangkat ini.";
});

draftList.addEventListener("click",(event)=>{
  const button=event.target.closest("button");if(!button)return;
  const index=Number(button.dataset.index);const drafts=getDrafts();
  if(button.classList.contains("load-draft")){
    const d=drafts[index];if(!d)return;
    selectPlatform(d.platform);caption.value=d.caption||"";updatePreviewText();
    message.textContent=d.hasMedia?"✓ Draft dibuka. Pilih kembali file medianya untuk menampilkan preview media.":"✓ Draft dibuka.";
    window.scrollTo({top:document.querySelector(".composer").offsetTop-15,behavior:"smooth"});
  }
  if(button.classList.contains("delete-draft")){drafts.splice(index,1);setDrafts(drafts);renderDrafts();message.textContent="Draft dihapus."}
});
clearDraftsButton.addEventListener("click",()=>{
  if(!getDrafts().length)return;
  localStorage.removeItem(DRAFT_KEY);renderDrafts();message.textContent="Semua draft dihapus.";
});
prepareButton.addEventListener("click",()=>{
  if(!caption.value.trim()&&!media.files.length){message.textContent="Isi caption atau tambahkan media terlebih dahulu.";return}
  message.textContent=`✓ Postingan ${currentPlatform} sudah disiapkan. Pengiriman asli belum aktif.`;
});
renderDrafts();