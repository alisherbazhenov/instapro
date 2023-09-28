import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { goToPage, getToken } from "../index.js";
import { likePost, getPosts, disLikePost } from "../api.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export function showingLikes(likes) {
	let likesLength = likes.length;

	if (likesLength === 0) {
		return 0;
	}

	if (likesLength === 1) {
		return `${likes[0].name}`;
	}

	return `${likes[likesLength - 1].name} и еще ${likesLength - 1}`;
}

export function renderPostsPageComponent({ appEl, posts }) {
	// TODO: реализовать рендер постов из api
	// console.log("Актуальный список постов:", posts);
	// мой код
	const postsHtml = posts.map((post) => {
		// дата и время
		const createDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ru })

		return `
	<li class="post">
	<div class="post-header" data-user-id="${post.user.id}">
		<img src="${post.user.imageUrl}" class="post-header__user-image">
		<p class="post-header__user-name">${post.user.name}</p>
	</div>
	<div class="post-image-container">
	  <img class="post-image" src="${post.imageUrl}">
	</div>
	<div class="post-likes">
	  <button data-post-id="${post.id}" data-dislike="${post.isLiked ? "true" : ''}" class="like-button">
		<img src="${post.isLiked ? `./assets/images/like-active.svg` : `./assets/images/like-not-active.svg`}">
	  </button>
	  <p class="post-likes-text">
		Нравится: <strong>${showingLikes(post.likes)}</strong>
	  </p>
	</div>
	<p class="post-text">
	  <span class="user-name">${post.user.name}</span>
	</p>
	<p class="post-date">
	${createDate}
	</p>
  </li>
		`
			;
	}).join('');


	/**
	 * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
	 * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
	 */


	const appHtml = `
			<div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  ${postsHtml}
                </ul>
            </div>`;

	appEl.innerHTML = appHtml;

	renderHeaderComponent({
		element: document.querySelector(".header-container"),
	});

	for (let userEl of document.querySelectorAll(".post-header")) {
		userEl.addEventListener("click", () => {
			goToPage(USER_POSTS_PAGE, {
				userId: userEl.dataset.userId,
			});
		});
	}


	for (let btnLike of document.querySelectorAll(".like-button")) {
		btnLike.addEventListener("click", () => {

			if (btnLike.dataset.dislike) {
				disLikePost({ id: btnLike.dataset.postId, token: getToken() }).then(() => {
					getPosts({ token: getToken() })
						.then((newPosts) => {

							renderPostsPageComponent({ appEl, posts: newPosts });
						})
				})
			}
			else {
				likePost({ id: btnLike.dataset.postId, token: getToken() }).then(() => {
					getPosts({ token: getToken() })
						.then((newPosts) => {

							renderPostsPageComponent({ appEl, posts: newPosts });
						})
				});
			}

		});
	}
}