import { uploadImage } from "../api.js";

export function renderUploadImageComponent({ element, onImageUrlChange }) {
  let imageUrl = "";

  const render = () => {
    element.innerHTML = `
      <div class="upload-image">
        ${
          imageUrl
            ? `
            <div class="file-upload-image-container">
              <img class="file-upload-image" src="${imageUrl}" alt="Загруженное изображение">
              <button class="file-upload-remove-button button">Заменить фото</button>
            </div>
            `
            : `
            <div class="upload-image-options">
              <label class="file-upload-label secondary-button">
                <input
                  type="file"
                  class="file-upload-input"
                  style="display:none"
                />
                Выберите фото
              </label>
              <div class="upload-url-container">
                <input type="text" class="input" id="upload-url-input" placeholder="Или вставьте URL изображения" />
                <button class="button" id="upload-url-button">Добавить</button>
              </div>
            </div>
          `
        }
      </div>
    `;

    const fileInputElement = element.querySelector(".file-upload-input");
    fileInputElement?.addEventListener("change", () => {
      const file = fileInputElement.files[0];
      if (file) {
        const labelEl = document.querySelector(".file-upload-label");
        labelEl.setAttribute("disabled", true);
        labelEl.textContent = "Загружаю файл...";

        uploadImage({ file })
          .then(({ fileUrl }) => {
            imageUrl = fileUrl;
            onImageUrlChange(imageUrl);
            render();
          })
          .catch((error) => {
            console.error(error);
            labelEl.removeAttribute("disabled");
            labelEl.textContent = "Выберите фото";
            alert(error.message || "Не удалось загрузить изображение");
          });
      }
    });

    const uploadUrlButton = element.querySelector("#upload-url-button");
    uploadUrlButton?.addEventListener("click", () => {
      const urlInput = element.querySelector("#upload-url-input");
      const url = urlInput?.value.trim();

      if (url) {
        imageUrl = url;
        onImageUrlChange(imageUrl);
        render();
      } else {
        alert("Введите URL изображения");
      }
    });

    element
      .querySelector(".file-upload-remove-button")
      ?.addEventListener("click", () => {
        imageUrl = "";
        onImageUrlChange(imageUrl);
        render();
      });
  };

  render();
}
