import "../pages/index.css";
import initialCards from "./cards.js";
import { createCard, deleteCard, handleLike } from "./card.js";
import { openModal, closeModal, setModalEventListeners } from "./modal.js";

const popupEdit = document.querySelector(".popup_type_edit");
const popupNewCard = document.querySelector(".popup_type_new-card");
const popupImage = document.querySelector(".popup_type_image");
const popups = document.querySelectorAll(".popup");

const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const closeButtons = document.querySelectorAll(".popup__close");

const formEditProfile = document.forms["edit-profile"];
const nameInput = formEditProfile.elements["name"];
const descriptionInput = formEditProfile.elements["description"];
const formNewCard = document.forms["new-place"];
const newCardNameInput = formNewCard.elements["place-name"];
const newCardLinkInput = formNewCard.elements["link"];

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const placesList = document.querySelector(".places__list");
const popupImageElement = popupImage.querySelector(".popup__image");
const popupCaptionElement = popupImage.querySelector(".popup__caption");

popups.forEach((popup) => setModalEventListeners(popup));

editButton.addEventListener("click", () => {
	nameInput.value = profileTitle.textContent;
	descriptionInput.value = profileDescription.textContent;
	openModal(popupEdit);
	
});

addButton.addEventListener("click", () => {
	openModal(popupNewCard);
});

closeButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const popup = button.closest(".popup");
		closeModal(popup);
	});
});

formEditProfile.addEventListener("submit", (evt) => {
	evt.preventDefault();
	profileDescription.textContent = descriptionInput.value;
	profileTitle.textContent = nameInput.value;
	formEditProfile.reset();
	closeModal(popupEdit)
});

formNewCard.addEventListener("submit", (evt) => {
	evt.preventDefault();
	const cardData = {
		name: newCardNameInput.value,
		link: newCardLinkInput.value,
	};
	const newCard = createCard(
		cardData,
		handleLike,
		handleImageClick,
		deleteCard
	);
	placesList.prepend(newCard);
	formNewCard.reset();
	closeModal(popupNewCard)
});



function handleImageClick(data) {
	popupImageElement.src = data.link;
	popupImageElement.alt = data.name;
	popupCaptionElement.textContent = data.name;
	openModal(popupImage);
}

initialCards.forEach((cardData) => {
	const cardElement = createCard(
		cardData,
		handleLike,
		handleImageClick,
		deleteCard
	);
	placesList.append(cardElement);
});
