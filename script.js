const platformButtons=document.querySelectorAll(".platform");
const selectedPlatform=document.getElementById("selectedPlatform");
const previewPlatform=document.getElementById("previewPlatform");
const caption=document.getElementById("caption");
const media=document.getElementById("media");
const previewCaption=document.getElementById("previewCaption");
const previewMedia=document.getElementById("previewMedia");
const prepareButton=document.getElementById("prepareButton");
const message=document.getElementById("message");
const charCount=document.getElementById("charCount");
const mediaInfo=document.getElementById("mediaInfo");
let currentPlatform="Instagram";
let previewUrl=null;

platformButtons.forEach(button=>{
  button.addEventListener("click",()=>{
    platformButtons.forEach(item=>item.classList.remove("active"));
    button.classList.add("active");
    currentPlatform=button.dataset.platform;
    selectedPlatform.textContent=currentPlatform;
    previewPlatform.textContent=currentPlatform;
    message.textContent="";
  });
});

caption.addEventListener("input",()=>{
  charCount.textContent=`${caption.value.length} / 2200`;
  previewCaption.textContent=caption.value.trim()||"Caption kamu akan muncul di sini...";
});

media.addEventListener("change",()=>{
  const file=media.files[0];
  if(!file)return;
  if(previewUrl)URL.revokeObjectURL(previewUrl);
  previewUrl=URL.createObjectURL(file);
  previewMedia.innerHTML="";
  const element=file.type.startsWith("video/")?document.createElement("video"):document.createElement("img");
  element.src=previewUrl;
  if(element.tagName==="VIDEO"){element.controls=true;element.muted=true;}
  previewMedia.appendChild(element);
  mediaInfo.textContent=`File: ${file.name} • ${Math.round(file.size/1024)} KB`;
  mediaInfo.classList.remove("hidden");
});

prepareButton.addEventListener("click",()=>{
  const hasCaption=caption.value.trim().length>0;
  const hasMedia=media.files.length>0;
  if(!hasCaption&&!hasMedia){
    message.textContent="Isi caption atau tambahkan media terlebih dahulu.";
    return;
  }
  message.textContent=`✓ Postingan ${currentPlatform} sudah disiapkan. Pengiriman asli belum aktif.`;
});
