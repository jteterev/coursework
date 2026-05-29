import { goToPage, likePost, user, posts, userPosts } from "../index.js";
import { renderHeaderComponent } from "./header-component.js";
import { USER_POSTS_PAGE } from "../routes.js";

export function renderPostsPageComponent({ appEl, postsData = null }) {
  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <ul class="posts"></ul>
      </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: appEl.querySelector(".header-container"),
    });

    const postsList = appEl.querySelector(".posts");
    const currentPosts = postsData !== null ? postsData : posts;

    if (currentPosts.length === 0) {
      postsList.innerHTML =
        '<li class="post"><p class="post-text">Постов пока нет</p></li>';
      return;
    }

    currentPosts.forEach((post) => {
      const postElement = document.createElement("li");
      postElement.className = "post";

      const likesCount = post.likes ? post.likes.length : 0;
      const isLiked = post.isLiked === true;
      const likeImageSrc = isLiked
        ? "./assets/images/like-active.svg"
        : "./assets/images/like-not-active.svg";

      const authorId = post.user?.id || post.authorId;
      const authorName = post.user?.name || post.authorName || "Неизвестно";
      const authorImageUrl = post.user?.imageUrl || post.authorImageUrl || "";

      postElement.innerHTML = `
        <div class="post-header" data-user-id="${authorId}">
          <img src="${authorImageUrl}" class="post-header__user-image">
          <p class="post-header__user-name">${authorName}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button" data-is-liked="${isLiked}">
            <img src="${likeImageSrc}" alt="Лайк">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${likesCount}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${authorName}</span>
          ${post.description || ""}
        </p>
        <p class="post-date">
          ${formatDate(post.createdAt)}
        </p>
      `;

      postsList.appendChild(postElement);
    });

    for (let userEl of appEl.querySelectorAll(".post-header")) {
      userEl.addEventListener("click", () => {
        goToPage(USER_POSTS_PAGE, {
          userId: userEl.dataset.userId,
        });
      });
    }

    for (let likeButton of appEl.querySelectorAll(".like-button")) {
      likeButton.addEventListener("click", async () => {
        if (!user) {
          alert("Для постановки лайка необходимо авторизоваться");
          return;
        }

        const postId = likeButton.dataset.postId;
        const isLiked = likeButton.dataset.isLiked === "true";
        const img = likeButton.querySelector("img");
        const likesText = likeButton
          .closest(".post-likes")
          .querySelector("strong");

        try {
          const updatedPost = await likePost(postId, isLiked);

          const likesCount = updatedPost.likes ? updatedPost.likes.length : 0;
          const newIsLiked = updatedPost.isLiked === true;

          img.src = newIsLiked
            ? "./assets/images/like-active.svg"
            : "./assets/images/like-not-active.svg";
          likesText.textContent = likesCount;
          likeButton.dataset.isLiked = newIsLiked;
        } catch (error) {
          console.error("Ошибка при постановке лайка:", error);
        }
      });
    }
  };

  render();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return "Только что";
  } else if (diffMins < 60) {
    return `${diffMins} минута${getSuffix(diffMins, "а", "ы", "")} назад`;
  } else if (diffHours < 24) {
    return `${diffHours} час${getSuffix(diffHours, "а", "ов", "")} назад`;
  } else if (diffDays < 7) {
    return `${diffDays} день${getSuffix(diffDays, "", "я", "ей")} назад`;
  } else {
    return date.toLocaleDateString("ru-RU");
  }
}

function getSuffix(number, suffix1, suffix2, suffix3) {
  const remainder100 = number % 100;
  const remainder10 = number % 10;

  if (remainder100 >= 11 && remainder100 <= 19) {
    return suffix3;
  }
  if (remainder10 === 1) {
    return suffix1;
  }
  if (remainder10 >= 2 && remainder10 <= 4) {
    return suffix2;
  }
  return suffix3;
}
