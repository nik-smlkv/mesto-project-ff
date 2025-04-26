import "../pages/index.css";
import initialCards from "./cards.js";
import { createCard, deleteCard } from "./card.js";
import { openModal, closeModal, setModalEventListeners } from "./modal.js";
import { enableValidation, clearValidation } from './validation.js';
import { getUserInfo, getInitialCards, addCard, updateUserInfo, likeCard, dislikeCard } from './api.js';

const profileName = document.querySelector('.profile__title');
const profileAbout = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');

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

const profileForm = document.querySelector('.popup_type_edit .popup__form');
const newPlaceForm = document.querySelector('.popup_type_new-card .popup__form');
const newCardForm = document.querySelector('.popup_type_new-card .popup__form');
const editForm = document.querySelector('.popup_type_edit .popup__form');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');

const validationConfig = {
	formSelector: '.popup__form',
	inputSelector: '.popup__input',
	submitButtonSelector: '.popup__button',
	inactiveButtonClass: 'popup__button_disabled',
	inputErrorClass: 'popup__input_type_error',
	errorClass: 'popup__error_visible'
};


enableValidation(validationConfig);

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


profileEditButton.addEventListener('click', () => {
	clearValidation(profileForm, validationConfig);
});

profileAddButton.addEventListener('click', () => {
	clearValidation(newPlaceForm, validationConfig);
});


function renderUserInfo({ name, about, avatar }) {
	profileName.textContent = name;
	profileAbout.textContent = about;
	profileAvatar.style.backgroundImage = `url(${avatar})`;
}

function renderCards(cards) {
	cards.forEach(card => {
		createCard(card.name, card.link, card.likes.length);
	});
}

Promise.all([getUserInfo(), getInitialCards()])
	.then(([userData, cards]) => {
		renderUserInfo(userData);
		renderCards(cards);
	})
	.catch(err => {
		console.error(err);
	});


function handleLike(cardId, isLiked) {
	const apiMethod = isLiked ? dislikeCard : likeCard;

	apiMethod(cardId)
		.then(updatedCard => {
			updateLikesCount(updatedCard._id, updatedCard.likes.length);
		})
		.catch(err => {
			console.error(err);
		});
}


newCardForm.addEventListener('submit', (e) => {
	e.preventDefault();

	const name = newCardForm.elements['place-name'].value;
	const link = newCardForm.elements.link.value;

	addCard(name, link)
		.then(card => {
			createCard(card.name, card.link, card.likes.length);
			closePopup();
		})
		.catch(err => {
			console.error(err);
		});
});


editForm.addEventListener('submit', (e) => {
	e.preventDefault();

	const name = editForm.elements.name.value;
	const about = editForm.elements.description.value;

	updateUserInfo(name, about)
		.then(userData => {
			renderUserInfo(userData);
			closePopup();
		})
		.catch(err => {
			console.error(err);
		});
});
