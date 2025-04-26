function showInputError(formElement, inputElement, errorMessage, settings) {
	const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
	inputElement.classList.add(settings.inputErrorClass);
	errorElement.textContent = errorMessage;
	errorElement.classList.add(settings.errorClass);
}

function hideInputError(formElement, inputElement, settings) {
	const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
	inputElement.classList.remove(settings.inputErrorClass);
	errorElement.classList.remove(settings.errorClass);
	errorElement.textContent = '';
}

function checkInputValidity(formElement, inputElement, settings) {
	if (!inputElement.validity.valid) {
		const errorMessage = inputElement.dataset.errorMessage || inputElement.validationMessage;
		showInputError(formElement, inputElement, errorMessage, settings);
	} else {
		hideInputError(formElement, inputElement, settings);
	}
}

function toggleButtonState(inputList, buttonElement, settings) {
	const isValid = inputList.every(inputElement => inputElement.validity.valid);
	buttonElement.disabled = !isValid;
	buttonElement.classList.toggle(settings.inactiveButtonClass, !isValid);
}

function setEventListeners(formElement, settings) {
	const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
	const buttonElement = formElement.querySelector(settings.submitButtonSelector);

	toggleButtonState(inputList, buttonElement, settings);

	inputList.forEach(inputElement => {
		inputElement.addEventListener('input', () => {
			checkInputValidity(formElement, inputElement, settings);
			toggleButtonState(inputList, buttonElement, settings);
		});
	});
}

function enableValidation(settings) {
	const formList = Array.from(document.querySelectorAll(settings.formSelector));
	formList.forEach(formElement => {
		formElement.addEventListener('submit', (evt) => {
			evt.preventDefault();
		});
		setEventListeners(formElement, settings);
	});
}

function clearValidation(formElement, settings) {
	const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
	const buttonElement = formElement.querySelector(settings.submitButtonSelector);

	inputList.forEach(inputElement => {
		hideInputError(formElement, inputElement, settings);
	});

	toggleButtonState(inputList, buttonElement, settings);
}

export { enableValidation, clearValidation };
