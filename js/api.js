// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
const personalKey = "alisher-bazhenov";
const baseHost = "https://webdev-hw-api.vercel.app";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
	return fetch(postsHost, {
		method: "GET",
		headers: {
			Authorization: token,
		},
	})
		.then((response) => {
			if (response.status === 401) {
				throw new Error("Нет авторизации");
			}

			return response.json();
		})
		.then((data) => {
			return data.posts;
		});
}

export function getUsersPost({ userId }) {
	return fetch(postsHost + `/user-posts/${userId}`, {
		method: "GET",
	})
		.then((response) => {
			if (response.status === 401) {
				throw new Error("Нет авторизации");
			}

			return response.json();
		})
		.then((data) => {
			return data.posts;
		});
}


// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
export function registerUser({ login, password, name, imageUrl }) {
	return fetch(baseHost + "/api/user", {
		method: "POST",
		body: JSON.stringify({
			login,
			password,
			name,
			imageUrl,
		}),
	}).then((response) => {
		if (response.status === 400) {
			throw new Error("Такой пользователь уже существует");
		}
		return response.json();
	});
}

export function loginUser({ login, password }) {
	return fetch(baseHost + "/api/user/login", {
		method: "POST",
		body: JSON.stringify({
			login,
			password,
		}),
	}).then((response) => {
		if (response.status === 400) {
			throw new Error("Неверный логин или пароль");
		}
		return response.json();
	});
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
	const data = new FormData();
	data.append("file", file);

	return fetch(baseHost + "/api/upload/image", {
		method: "POST",
		body: data,
	}).then((response) => {
		return response.json();
	});

}

export function likePost({ id, token }) {
	return fetch(`${postsHost}/${id}/like`, {
		method: "POST",
		headers: {
			Authorization: token,
		},
	}).then((response) => {
		return response.json();
	});
}

export function disLikePost({ id, token }) {
	return fetch(`${postsHost}/${id}/dislike`, {
		method: "POST",
		headers: {
			Authorization: token,
		},
	}).then((response) => {
		return response.json();
	});
}

export function uploadPost({ token, description, imageUrl }) {
	return fetch(postsHost, {
		method: "POST",
		headers: {
			Authorization: token
		},
		body: JSON.stringify({
			description,
			imageUrl
		})
	})
		.then((response) => {
			if (response.status === 201) {
				return response.json();
			} else if (response.status === 400) {
				throw new Error(
					"Что-то пошло не так. Проверьте данные и попробуйте снова."
				);
			} else {
				throw new Error(
					"Произошла ошибка при загрузке поста. Пожалуйста, попробуйте позже."
				);
			}
		})
		.catch((error) => {
			alert("Произошла ошибка:", error);
			throw error;
		});
}