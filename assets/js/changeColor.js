function handleCanvasProcessing() {
  const cards = document.querySelectorAll(".card");

  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const parentWidth = card.offsetWidth;
      const parentHeight = card.offsetHeight;

      const img = card.querySelector("img");

      const width = parentWidth;
      const height = parentHeight;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      const quarterWidth = width / 2;
      const quarterHeight = height / 2;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4;
          let color = "#FFFFFF";

          if (x < quarterWidth && y < quarterHeight) {
            color = "#4285F4";
          } else if (x >= quarterWidth && y < quarterHeight) {
            color = "#34A853";
          } else if (x < quarterWidth && y >= quarterHeight) {
            color = "#FBBC05";
          } else if (x >= quarterWidth && y >= quarterHeight) {
            color = "#EA4335";
          }

          data[index] = parseInt(color.substr(1, 2), 16);
          data[index + 1] = parseInt(color.substr(3, 2), 16);
          data[index + 2] = parseInt(color.substr(5, 2), 16);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      img.src = canvas.toDataURL();
    });
  });
}
