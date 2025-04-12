import initialCards from "./cards.js";

const createCard = (data, deleteCard) => {

  const cardTemplate = document
    .querySelector("#card-template")
    .content.cloneNode(true);
  const cardElement = cardTemplate.querySelector(".card");

  cardElement.querySelector(".card__title").textContent = data.name;
  cardElement.querySelector(".card__image").src = data.link;
  cardElement.querySelector(".card__image").alt = data.name;
  cardElement.querySelector(".card__delete-button").addEventListener("click", deleteCard);

  return cardElement;
};

const deleteCard = (event) => {
    let currentCard = event.target.parentElement;
    currentCard.remove();
};

const placesList = document.querySelector(".places__list");

initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData, deleteCard);
  placesList.append(cardElement);
});
