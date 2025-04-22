export function openModal(modal) {
  modal.classList.add("popup_is-opened");
  document.addEventListener("keydown", closeModalEsc);
}

export function closeModal(modal) {
  modal.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closeModalEsc);
}

function closeModalEsc(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".popup_is-opened");
    closeModal(openedModal);
  }
}

export function setModalEventListeners(modal) {
  modal.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("popup_is-opened")) {
      closeModal(modal);
    }
  });
}
