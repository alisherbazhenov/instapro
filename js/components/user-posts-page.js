import { renderHeaderComponent } from "./header-component";
import { showingLikes } from "./posts-page-component";
import { likePost, disLikePost, getUsersPost } from "../api";
import { getToken, userId } from "../index.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export function renderUserPostsPage({ appEl, posts }) {

	const userPostsHtml = posts.map((post) => {
		const isLike = Boolean(post.likes.find(el => el._id === userId))

		const createDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ru })

		return `
		<li class="post">
            <div class="post-image-container">
              <img class="post-image" src="${post.imageUrl}">
            </div>
            <div class="post-likes">
              <button data-post-id="${post.id}" data-dislike="${isLike}" class="like-button">
                <img src="${isLike ? `./assets/images/like-active.svg` : `./assets/images/like-not-active.svg`}">
              </button>
              <p class="post-likes-text">
                Нравится: <strong>${showingLikes(post.likes)}</strong>
              </p>
            </div>
            <p class="post-text">
              <span class="user-name">${post.user.name}</span>
              ${post.description}
            </p>
            <p class="post-date">
              ${createDate} 
            </p>
          </li>
		`;
	}).join('');

	const pageUserPostsHtml =
		`
		<div class="page-container">
		<div class="header-container"></div>
		<div class="posts-user-header">
		<img src="${posts[0].user.imageUrl}" class="posts-user-header__user-image">
		<p class="posts-user-header__user-name">${posts[0].user.name}</p>
		</div>
		<ul class="posts">
		  ${userPostsHtml}
		</ul>
		<br>
	</div>
	`;


	appEl.innerHTML = pageUserPostsHtml;

	renderHeaderComponent({
		element: document.querySelector(".header-container"),
	});

	for (let btnLike of document.querySelectorAll(".like-button")) {
		btnLike.addEventListener("click", () => {

			if (btnLike.dataset.dislike === 'true') {

				disLikePost({ id: btnLike.dataset.postId, token: getToken() }).then(() => {
					getUsersPost({ userId })
						.then((newPosts) => {

							renderUserPostsPage({ appEl, posts: newPosts });
						})
				})
			}
			else {

				likePost({ id: btnLike.dataset.postId, token: getToken() }).then(() => {
					getUsersPost({ userId })
						.then((newPosts) => {

							renderUserPostsPage({ appEl, posts: newPosts });
						})
				});
			}

		});
	}

}