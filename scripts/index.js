import initialCards from "./cards.js";
const placesList = document.querySelector(".places__list");

const createCard = (data, deleteCard) => {
  const cardTemplate = document
    .querySelector("#card-template")
    .content.cloneNode(true);
  const cardElement = cardTemplate.querySelector(".card");
  const cardElementImage = cardElement.querySelector(".card__image");
  cardElement.querySelector(".card__title").textContent = data.name;
  cardElementImage.src = data.link;
  cardElementImage.alt = data.name;
  cardElement
    .querySelector(".card__delete-button")
    .addEventListener("click", deleteCard);

  return cardElement;
};

const deleteCard = (event) => {
  event.target.parentElement.remove();
};

initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData, deleteCard);
  placesList.append(cardElement);
});
