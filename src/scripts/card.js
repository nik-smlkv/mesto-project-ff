import { handleDelete, handleLike, handleImageClick } from "./index";

export function createCard(name, link, countLike, cardId, likedCard) {
	const cardTemplate = document.querySelector("#card-template").content;
	const cardElement = cardTemplate.cloneNode(true);
	const cardImage = cardElement.querySelector(".card__image");
	const cardTitle = cardElement.querySelector(".card__title");
	const likeButton = cardElement.querySelector(".card__like-button");
	const deleteButton = cardElement.querySelector(".card__delete-button");
	cardImage.src = link;
	cardImage.alt = name;
	cardTitle.textContent = name;
	likeButton.textContent = countLike;
	likedCard ? likeButton.classList.add('card__like-button_is-active') : null;
	
	likeButton.addEventListener("click", (evt) => {
		const isLiked = evt.target.classList.contains('card__like-button_is-active');
		handleLike(isLiked, cardId, evt.target)
	});
	cardImage.addEventListener("click", () => handleImageClick(link, name));
	deleteButton.addEventListener("click", (evt) => handleDelete(evt.target.closest(".card"), cardId));
	return cardElement;
}

