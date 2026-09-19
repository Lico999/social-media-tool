const platformButtons = document.querySelectorAll(".platform");
const selectedPlatform = document.getElementById("selectedPlatform");
const prepareButton = document.getElementById("prepareButton");
const caption = document.getElementById("caption");
const media = document.getElementById("media");
const message = document.getElementById("message");

let currentPlatform = "Instagram";

platformButtons.forEach((button) => {
  button.addEventListener("click", () => {
    platformButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    currentPlatform = button.dataset.platform;
    selectedPlatform.textContent = `Platform dipilih: ${currentPlatform}`;
    message.textContent = "";
  });
});

prepareButton.addEventListener("click", () => {
  const hasCaption = caption.value.trim().length > 0;
  const hasMedia = media.files.length > 0;

  if (!hasCaption && !hasMedia) {
    message.textContent = "Isi caption atau pilih gambar/video terlebih dahulu.";
    return;
  }

  message.textContent =
    `Postingan ${currentPlatform} sudah disiapkan. Pengiriman asli belum aktif.`;
});
