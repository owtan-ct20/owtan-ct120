console.log("yada");

const chapContents = document.querySelectorAll(".content");
const staticImages = document.querySelectorAll(".staticImage");
const maxBlurReached = new Array(chapContents.length).fill(0);
const maxOpacityReached = new Array(staticImages.length).fill(0);

window.addEventListener("scroll", () => {
  chapContents.forEach((content, i) => {

    const rect = content.getBoundingClientRect();

    let blurAmount = 0;

    if (i < chapContents.length - 1) {
      let visibility = 1 - (rect.bottom / window.innerHeight);
      visibility = Math.max(0, Math.min(1, visibility));

      if (visibility > 0.2) {
        blurAmount = (visibility - 0.2) / 0.8 * 8; 
      }
    }
    maxBlurReached[i] = Math.max(maxBlurReached[i], blurAmount);

    content.style.filter = `blur(${maxBlurReached[i]}px)`;

    let opacity = 0;
    let prog = 1 - (rect.bottom / window.innerHeight);
    prog = Math.max(0, Math.min(1, prog));
    opacity = prog;

    if(staticImages[i]) {
        maxOpacityReached[i] = Math.max(maxOpacityReached[i], opacity);
        staticImages[i].style.opacity = maxOpacityReached[i];
    }
  });
});