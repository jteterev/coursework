import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Добавить пост</h3>
          <div class="form-inputs">
            <div class="upload-image-container"></div>
            <textarea 
              class="textarea" 
              id="description-input" 
              placeholder="Опишите ваше фото..."
            ></textarea>
            <div class="form-error"></div>
            <button class="button" id="add-button">Опубликовать</button>
          </div>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    const setError = (message) => {
      appEl.querySelector(".form-error").textContent = message;
    };

    // Рендерим заголовок страницы
    renderHeaderComponent({
      element: appEl.querySelector(".header-container"),
    });

    // Рендерим компонент загрузки изображения
    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    // Обработчик клика на кнопку публикации
    document.getElementById("add-button").addEventListener("click", () => {
      setError("");

      const description = document
        .getElementById("description-input")
        .value.trim();

      if (!description) {
        alert("Введите описание поста");
        return;
      }

      if (!imageUrl) {
        alert("Выберите фотографию");
        return;
      }

      onAddPostClick({ description, imageUrl });
    });
  };

  render();
}
