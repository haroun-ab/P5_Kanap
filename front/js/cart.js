// Initialiser les variables du prix et de la quantité totale
let totalQuantity = 0;
let totalPrice = 0;

// Récupérer les données (noms, prix, images) des produits depuis l'API
async function GetProductData(i, cartData) {
  const response = await fetch(
    `http://localhost:3000/api/products/${cartData.id}`
  );
  const productData = await response.json();
  displayCartProduct(i, productData, cartData);
}
// Itération pour chaque produit du local storage
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  let cartData = JSON.parse(localStorage.getItem(key));
  GetProductData(i, cartData);
}

function displayCartProduct(i, productData, cartData) {
  console.log(productData);
  createArticleElement(cartData);
  addImageElement(i, productData);
  addContentElement(i, cartData, productData);

  calculateTotalQuantityAndPrice(cartData, productData);
}
// Création d'un article pour chaque élément du LS, contenant les informations du produit
function createArticleElement(cartData) {
  const article = document.createElement('article');
  article.classList = 'cart__item';
  article.setAttribute('data-id', cartData.id);
  article.setAttribute('data-color', cartData.color);
  document.querySelector('#cart__items').appendChild(article);
}
// Ajout d'une image, pour chaque élément du LS, représentant l'aspect visuel du produit
function addImageElement(i, productData) {
  const imgDiv = document.createElement('div');
  document
    .querySelector(`#cart__items article:nth-child(${i + 1})`)
    .appendChild(imgDiv);
  imgDiv.classList = 'cart__item__img';

  const img = document.createElement('img');
  img.src = productData.imageUrl;
  img.alt = "Photographie d'un canapé";
  imgDiv.appendChild(img);
}
// Création d'une div "content" pour chaque élément du LS, contenant le nom, la couleur et le prix du produit
function addContentElement(i, cartData, productData) {
  const contentDiv = document.createElement('div');
  document
    .querySelector(`#cart__items article:nth-child(${i + 1})`)
    .appendChild(contentDiv);
  contentDiv.classList = 'cart__item__content';

  addDescriptionElement(cartData, productData, contentDiv);
  addSettingsElement(i, cartData, productData, contentDiv);
}

// Ajout d'une description pour chaque éléments du LS
function addDescriptionElement(cartData, productData, contentDiv) {
  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList = 'cart__item__content__description';
  contentDiv.appendChild(descriptionDiv);

  const name = document.createElement('h2');
  name.innerText = productData.name;
  descriptionDiv.appendChild(name);

  const color = document.createElement('p');
  descriptionDiv.appendChild(color);
  color.innerText = `${cartData.color}`;

  const price = document.createElement('p');
  price.innerHTML = `<span>${productData.price}</span> €`;
  descriptionDiv.appendChild(price);
}

// Création d'une div "settings" pour chaque éléments du LS, contenant la quantité et le bouton 'supprimer'
function addSettingsElement(i, cartData, productData, contentDiv) {
  const settingsDiv = document.createElement('div');
  settingsDiv.classList = 'cart__item__content__settings';
  contentDiv.appendChild(settingsDiv);

  addQuantityElement(i, settingsDiv, cartData, productData);
  addDeleteBtnElement(cartData, settingsDiv, productData);
}

// Ajout de la quantité pour chaque éléments du LS
function addQuantityElement(i, settingsDiv, cartData, productData) {
  const quantityDiv = document.createElement('div');
  quantityDiv.classList = 'cart__item__content__settings__quantity';
  settingsDiv.appendChild(quantityDiv);

  const quantity = document.createElement('p');
  quantity.innerText = 'Qté : ';
  quantityDiv.appendChild(quantity);

  const quantityInput = document.createElement('input');
  quantityInput.type = 'number';
  quantityInput.classList = 'itemQuantity';
  quantityInput.name = 'itemQuantity';
  quantityInput.min = '1';
  quantityInput.max = '100';
  quantityInput.value = cartData.quantity;
  quantityInput.setAttribute('value', cartData.quantity);
  quantityDiv.appendChild(quantityInput);

  // Lorsqu'on change la quantité, on applique la fonction 'changesValues'
  quantityInput.onchange = () =>
    changeValues(i, cartData, quantityInput, productData);
}

// Mise à jour des données dans le LS après une modification
function changeValues(i, cartData, quantityInput, productData) {
  if (quantityInput.value > 0) {
    totalQuantity -= cartData.quantity;
    totalPrice -= productData.price * cartData.quantity;

    cartData.quantity =
      document.querySelectorAll('.itemQuantity')[i].valueAsNumber;

    localStorage.setItem(
      quantityInput.closest('.cart__item').getAttribute('data-id') +
        ' ' +
        quantityInput.closest('.cart__item').getAttribute('data-color'),
      JSON.stringify(cartData)
    );
    calculateTotalQuantityAndPrice(cartData, productData);
  } else {
    alert('Veuillez saisir une quantité valide.');
    document.querySelectorAll('.itemQuantity')[i].valueAsNumber = 1;
  }
}

// Ajout d'un bouton supprimer pour chaque éléments du LS
function addDeleteBtnElement(cartData, settingsDiv, productData) {
  const deleteDiv = document.createElement('div');
  deleteDiv.classList = 'cart__item__content__settings__delete';
  settingsDiv.appendChild(deleteDiv);

  const deleteItem = document.createElement('p');
  deleteItem.classList = 'deleteItem';
  deleteItem.innerText = 'Supprimer';

  // Au clique, suppression du produit ciblé du LS et de la page cart
  deleteItem.onclick = () => {
    deleteItem.closest('.cart__item').style.display = 'none';

    localStorage.removeItem(
      deleteItem.closest('.cart__item').getAttribute('data-id') +
        ' ' +
        deleteItem.closest('.cart__item').getAttribute('data-color')
    );

    cartData.quantity = -deleteItem
      .closest('.cart__item__content__settings')
      .querySelector('.cart__item__content__settings__quantity')
      .querySelector('.itemQuantity').value;

    calculateTotalQuantityAndPrice(cartData, productData);
  };

  deleteDiv.appendChild(deleteItem);
}

// Affichage des totaux des prix et des quantités
function calculateTotalQuantityAndPrice(cartData, productData) {
  totalQuantity += cartData.quantity;
  document.querySelector('#totalQuantity').innerText = totalQuantity;

  totalPrice += productData.price * cartData.quantity;
  document.querySelector('#totalPrice').innerText = totalPrice;
}
// *************************** FORM *****************************
// Si il n'y a pas de produit dans le panier, le formulaire ne s'affcihera pas
if (localStorage.length === 0)
  document.querySelector('.cart__order__form').style.display = 'none';

const form = document.querySelector('.cart__order__form');
formValidation(form);
postForm(form);
// Vérification de la conformité des champs de saisie à chaque modification
function formValidation(form) {
  const firstNameInput = form[0];
  firstNameInput.onchange = () => isFirstNameValid(firstNameInput);

  const lastNameInput = form[1];
  lastNameInput.onchange = () => isLastNameValid(lastNameInput);

  const addressInput = form[2];
  addressInput.onchange = () => isAddressValid(addressInput);

  const cityInput = form[3];
  cityInput.onchange = () => isCityValid(cityInput);

  const emailInput = form[4];
  emailInput.onchange = () => isEmailValid(emailInput);
}
// Le prénom ne doit pas posséder de chiffres
function isFirstNameValid(input) {
  input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1);

  const firstNameRegExp = new RegExp('[A-Za-zéèêôöîïâäàûüùç -]+$', 'g');
  if (input.value.length < 2) {
    window.firstNameErrorMsg.innerText = 'Veuillez renseigner ce formulaire.';
  } else if (!firstNameRegExp.test(input.value)) {
    window.firstNameErrorMsg.innerText =
      'Le prénom ne doit pas contenir des chiffres ou des symboles.';
    window.order.disabled = 'disabled';
  } else {
    window.firstNameErrorMsg.innerText = '';
    activeBtn();
  }
}
// Le nom ne doit pas posséder de chiffres
function isLastNameValid(input) {
  console.log(input.value.length);
  input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1);
  const lastNameRegExp = new RegExp('^[A-Za-zéèêôöîïâäàûüùç -]+$', 'g');
  if (input.value.length < 2 || input.value == '') {
    window.lastNameErrorMsg.innerText = 'Veuillez renseigner ce formulaire.';
  } else if (!lastNameRegExp.test(input.value)) {
    window.lastNameErrorMsg.innerText =
      'Le nom ne doit pas contenir des chiffres ou des symboles.';
    window.order.disabled = 'disabled';
  } else {
    window.lastNameErrorMsg.innerText = '';
    activeBtn();
  }
}
// L'adresse doit posséder au minimum 6 caractères
function isAddressValid(input) {
  const addressRegExp = new RegExp('^[0-9a-zA-Z -.éèêôöîïâäàûüùç]{3,}$', 'g');

  if (!addressRegExp.test(input.value) || input.value == '') {
    window.addressErrorMsg.innerText = 'Veuillez renseigner ce formulaire.';
    window.order.disabled = 'disabled';
  } else {
    window.addressErrorMsg.innerText = '';
    activeBtn();
  }
}
// La ville doit posséder au minimum 3 lettres
function isCityValid(input) {
  input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1);
  const cityRegExp = new RegExp('^[a-zA-Z -.éèêôöîïâäàûüùç]{3,}$', 'g');
  if (!cityRegExp.test(input.value) || input.value == '') {
    window.cityErrorMsg.innerText = 'Veuillez renseigner ce formulaire.';
    window.order.disabled = 'disabled';
  } else {
    window.cityErrorMsg.innerText = '';
    activeBtn();
  }
}
// L'adresse email doit avoir cette forme = xxx@xxx.com
function isEmailValid(input) {
  const emailRegExp = new RegExp(
    '^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$',
    'g'
  );
  if (input.value.length < 5 || input.value == '') {
    window.emailErrorMsg.innerText = 'Veuillez renseigner ce formulaire.';
  } else if (!emailRegExp.test(input.value)) {
    window.emailErrorMsg.innerText = "L'adresse mail n'est pas valide";
    window.order.disabled = 'disabled';
  } else {
    window.emailErrorMsg.innerText = '';
    activeBtn();
  }
}
// Activation du bouton si tous les éléments saisis sont conformes
function activeBtn() {
  if (
    window.firstNameErrorMsg.innerText == '' &&
    window.lastNameErrorMsg.innerText == '' &&
    window.addressErrorMsg.innerText == '' &&
    window.cityErrorMsg.innerText == '' &&
    window.emailErrorMsg.innerText == ''
  ) {
    window.order.removeAttribute('disabled');
  }
}
// Au clique du bouton order, envoie d'une requête POST à l'API
function postForm(form) {
  form.onsubmit = (e) => {
    e.preventDefault();
    // Extraction de l' id des produits à partir de leur clé
    const key =
      document
        .querySelector('.deleteItem')
        .closest('.cart__item')
        .getAttribute('data-id') +
      ' ' +
      document
        .querySelector('.deleteItem')
        .closest('.cart__item')
        .getAttribute('data-color');

    const id = key.split(' ')[0];

    // Structure de la requête attendu par l'API
    const formValues = {
      contact: {
        firstName: document.querySelector('#firstName').value,
        lastName: document.querySelector('#lastName').value,
        address: document.querySelector('#address').value,
        city: document.querySelector('#city').value,
        email: document.querySelector('#email').value,
      },
      products: [],
    };

    for (i = 0; i < localStorage.length; i++) {
      formValues.products.push(id);
    }

    postUserCart(formValues);
  };
}

// Envoie de la requête POST à l'API avec la méthode fetch
async function postUserCart(formValues) {
  const response = await fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    body: JSON.stringify(formValues),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const dataToPost = await response.json();
  getOrderId(dataToPost);
}

// Récupération de l'id de commande qu'on stockera par la suite dans l'URL de la page de confirmation pour le réutiliser
function getOrderId(data) {
  console.log(data);
  console.log(data.orderId);
  document.location.href = `./confirmation.html?id=${data.orderId}`;
  deleteCart();
}
//Suppression du panier quand la commande est passé
function deleteCart() {
  localStorage.clear();
}
