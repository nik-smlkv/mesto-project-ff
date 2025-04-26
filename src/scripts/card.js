export function createCard(data, handleLike, handleImageClick, handleDelete) {
	const cardTemplate = document.querySelector("#card-template").content;
	const cardElement = cardTemplate.cloneNode(true);
	const cardImage = cardElement.querySelector(".card__image");
	const cardTitle = cardElement.querySelector(".card__title");
	const likeButton = cardElement.querySelector(".card__like-button");
	const deleteButton = cardElement.querySelector(".card__delete-button");

	cardImage.src = data.link;
	cardImage.alt = data.name;
	cardTitle.textContent = data.name;

	likeButton.addEventListener("click", handleLike);
	cardImage.addEventListener("click", () => handleImageClick(data));
	deleteButton.addEventListener("click", handleDelete);

	return cardElement;
}
export function handleLike(evt) {
	evt.target.classList.toggle("card__like-button_is-active");
}
export const deleteCard = (event) => {
	event.target.closest('.card').remove();
};
