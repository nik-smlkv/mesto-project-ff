import "../pages/index.css";
import initialCards from "./cards.js";
import { createCard } from "./card.js";
import { openModal, closeModal, setModalEventListeners } from "./modal.js";
import { enableValidation, clearValidation } from "./validation.js";
import {
	getUserInfo,
	getInitialCards,
	addCard,
	updateUserInfo,
	likeCard,
	deleteCard,
	dislikeCard,
	updateAvatar
} from "./api.js";


let cardToDelete;
let cardIdToDelete;
let cardToLike;
let userId;

const profileName = document.querySelector(".profile__title");
const profileAbout = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const popupCheckDel = document.querySelector(".popup_type_check-delete");
const popupEdit = document.querySelector(".popup_type_edit");
const popupNewCard = document.querySelector(".popup_type_new-card");
const popupImage = document.querySelector(".popup_type_image");
const popups = document.querySelectorAll(".popup");
const placesList = document.querySelector(".places__list");
const confirmDelBtn = document.querySelector('.popup__button_check-delete');
const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");
const closeButtons = document.querySelectorAll(".popup__close");

const formEditProfile = document.forms["edit-profile"];
const nameInput = formEditProfile.elements["name"];
const descriptionInput = formEditProfile.elements["description"];


const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const popupImageElement = popupImage.querySelector(".popup__image");
const popupCaptionElement = popupImage.querySelector(".popup__caption");

const profileForm = document.querySelector(".popup_type_edit .popup__form");
const newPlaceForm = document.querySelector(
	".popup_type_new-card .popup__form"
);
const newCardForm = document.forms["new-place"];
const newCardNameInput = newCardForm.elements["place-name"];
const newCardLinkInput = newCardForm.elements["link"];
const editForm = document.querySelector(".popup_type_edit .popup__form");
const profileEditButton = document.querySelector(".profile__edit-button");
const profileAddButton = document.querySelector(".profile__add-button");

const formUpdateAvatar = document.forms["edit-avatar"];
const popupUpdateAvatar = document.querySelector(".popup_type_edit_avatar");
const updateAvatarInput = formUpdateAvatar.elements["url"];
const profileImageUpdateBtn = document.querySelector(".profile__image");
const validationConfig = {
	formSelector: ".popup__form",
	inputSelector: ".popup__input",
	submitButtonSelector: ".popup__button",
	inactiveButtonClass: "popup__button_disabled",
	inputErrorClass: "popup__input_type_error",
	errorClass: "popup__error_visible",
};


enableValidation(validationConfig);

popups.forEach((popup) => setModalEventListeners(popup));

closeButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const popup = button.closest(".popup");
		closeModal(popup);
	});
});

editButton.addEventListener("click", () => {
	nameInput.value = profileTitle.textContent;
	descriptionInput.value = profileDescription.textContent;
	openModal(popupEdit);
});
profileImageUpdateBtn.addEventListener("click", () => {
	const style = getComputedStyle(profileImageUpdateBtn);
	const backgroundImage = style.backgroundImage;
	const imageUrl = backgroundImage.slice(5, -2);
	updateAvatarInput.value = imageUrl;
	openModal(popupUpdateAvatar);
});

addButton.addEventListener("click", () => {
	openModal(popupNewCard);
});

formEditProfile.addEventListener("submit", (evt) => {
	evt.preventDefault();
	const submitButton = evt.submitter;
	submitButton.dataset.originalText = submitButton.textContent;
	renderLoading(true, submitButton);

	updateUserInfo(nameInput.value, descriptionInput.value)
		.then((userData) => {
			profileTitle.textContent = userData.name;
			profileDescription.textContent = userData.about;
			closeModal(popupEdit);
		})
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			renderLoading(false, submitButton);
		});
});

newCardForm.addEventListener("submit", (evt) => {
	evt.preventDefault();
	const submitButton = evt.submitter;
	submitButton.dataset.originalText = submitButton.textContent;
	renderLoading(true, submitButton);
	const name = newCardNameInput.value;
	const link = newCardLinkInput.value;
	renderLoading(true, submitButton);
	addCard(name, link)
		.then((card) => {
			const newCard = createCard(card.name, card.link, card.likes.length, card._id);
			placesList.prepend(newCard);
			closeModal(popupNewCard);
		})
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			renderLoading(false, submitButton);
		});
});

formUpdateAvatar.addEventListener("submit", (evt) => {
	evt.preventDefault();
	const submitButton = evt.submitter;
	submitButton.dataset.originalText = submitButton.textContent;
	renderLoading(true, submitButton);

	updateAvatar(updateAvatarInput.value)
		.then((userData) => {
			profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
			closeModal(popupUpdateAvatar);
		})
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			renderLoading(false, submitButton);
		});
});

profileEditButton.addEventListener("click", () => {
	clearValidation(profileForm, validationConfig);
});

profileAddButton.addEventListener("click", () => {
	clearValidation(newPlaceForm, validationConfig);
});

profileAvatar.addEventListener("click", () => {
	clearValidation(formUpdateAvatar, validationConfig);
});

function renderUserInfo({ name, about, avatar, _id }) {

	profileName.textContent = name;
	profileAbout.textContent = about;
	profileAvatar.style.backgroundImage = `url(${avatar})`;
	userId = _id;
}

function renderCards(cards) {
	cards.forEach((card) => {
		const likedCard = card.likes.map(like => like._id);
		const renderCard = createCard(card.name, card.link, card.likes.length, card._id, likedCard.includes(userId));
		placesList.append(renderCard);
	});
}

Promise.all([getUserInfo(), getInitialCards()])
	.then(([userData, cards]) => {
		console.log(userData)
		renderUserInfo(userData);
		renderCards(cards);
	})
	.catch((err) => {
		console.error(err);
	});

export function handleLike(isLiked, cardId, currentLike) {
	const apiMethod = !isLiked ? likeCard : dislikeCard;
	apiMethod(cardId)
		.then((updatedCard) => {
			currentLike.classList.toggle('card__like-button_is-active');
			updateLikesCount(updatedCard._id, updatedCard.likes.length, currentLike);
		})
		.catch((err) => {
			console.error(err);
		});
}


editForm.addEventListener("submit", (e) => {
	e.preventDefault();

	const name = editForm.elements.name.value;
	const about = editForm.elements.description.value;

	updateUserInfo(name, about)
		.then((userData) => {
			renderUserInfo(userData);
			closeModal();
		})
		.catch((err) => {
			console.error(err);
		});
});


confirmDelBtn.addEventListener("click", () => {
	renderLoading(true, confirmDelBtn);
	deleteCard(cardIdToDelete)
		.then(() => {
			cardToDelete.remove();
			closeModal(popupCheckDel);
		})
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			renderLoading(false, confirmDelBtn);
		});
});

export function handleDelete(cardElement, cardId) {
	cardToDelete = cardElement;
	cardIdToDelete = cardId;
	openModal(popupCheckDel);
}

export function handleImageClick(link, name) {
	popupImageElement.src = link;
	popupImageElement.alt = name;
	popupCaptionElement.textContent = name;
	openModal(popupImage);
}

function renderLoading(isRender, button) {
	return isRender ? button.textContent = "Сохранение..." : button.textContent = button.getAttribute("data-original-text");
}
function updateLikesCount(cardId, countLikes, likeButton) {
	cardToLike = cardId;
	likeButton.textContent = countLikes;
}