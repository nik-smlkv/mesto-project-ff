const config = {
	baseUrl: 'https://nomoreparties.co/v1/wff-cohort-36',
	headers: {
		authorization: '600055b7-ffa5-4b41-9978-3ac396c47928',
		'Content-Type': 'application/json'
	}
};


function request(url, options) {
	return fetch(url, options)
		.then(res => {
			if (res.ok) {
				return res.json();
			}
			return Promise.reject(`Ошибка: ${res.status}`);
		});
}


export function getUserInfo() {
	return request(`${config.baseUrl}/users/me`, {
		headers: config.headers
	});
}


export function getInitialCards() {
	return request(`${config.baseUrl}/cards`, {
		headers: config.headers
	});
}

export function updateUserInfo(name, about) {
	return request(`${config.baseUrl}/users/me`, {
		method: 'PATCH',
		headers: config.headers,
		body: JSON.stringify({
			name,
			about
		})
	});
}

export function addCard(name, link) {
	return request(`${config.baseUrl}/cards`, {
		method: 'POST',
		headers: config.headers,
		body: JSON.stringify({
			name,
			link
		})
	});
}

export function updateAvatar(avatar) {
	return request(`${config.baseUrl}/users/me/avatar`, {
		method: 'PATCH',
		headers: config.headers,
		body: JSON.stringify({
			avatar
		})
	});
}

export function deleteCard(cardId) {
	return request(`${config.baseUrl}/cards/${cardId}`, {
		method: 'DELETE',
		headers: config.headers
	});
}


export function likeCard(cardId) {
	return request(`${config.baseUrl}/cards/likes/${cardId}`, {
		method: 'PUT',
		headers: config.headers
	});
}


export function dislikeCard(cardId) {
	return request(`${config.baseUrl}/cards/likes/${cardId}`, {
		method: 'DELETE',
		headers: config.headers
	});
}
