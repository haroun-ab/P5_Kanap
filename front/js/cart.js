// Initialiser les variables du prix et de la quantité totale
let totalQuantity = 0;
let totalPrice = 0;

// Si il n'y a pas de produit dans le panier, le formulaire ne s'affcihera pas
if (localStorage.length === 0)
  document.querySelector('.cart__order__form').style.display = 'none';

// Itération pour chaque produit du local storage
for (i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  let cartData = JSON.parse(localStorage.getItem(key));
  createArticleElement(cartData);
  addImageElement(i, cartData);
  addContentElement(i, cartData);

  calculateTotalQuantityAndPrice(cartData);
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
function addImageElement(i, cartData) {
  const imgDiv = document.createElement('div');
  document
    .querySelector(`#cart__items article:nth-child(${i + 1})`)
    .appendChild(imgDiv);
  imgDiv.classList = 'cart__item__img';

  const img = document.createElement('img');
  img.src = cartData.imgUrl;
  img.alt = "Photographie d'un canapé";
  imgDiv.appendChild(img);
}
// Création d'une div "content" pour chaque élément du LS, contenant le nom, la couleur et le prix du produit
function addContentElement(i, cartData) {
  const contentDiv = document.createElement('div');
  document
    .querySelector(`#cart__items article:nth-child(${i + 1})`)
    .appendChild(contentDiv);
  contentDiv.classList = 'cart__item__content';

  addDescriptionElement(i, cartData, contentDiv);
}

// Ajout d'une description pour chaque éléments du LS
function addDescriptionElement(i, cartData, contentDiv) {
  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList = 'cart__item__content__description';
  contentDiv.appendChild(descriptionDiv);

  const name = document.createElement('h2');
  name.innerText = cartData.name;
  descriptionDiv.appendChild(name);

  const color = document.createElement('p');
  descriptionDiv.appendChild(color);
  color.innerText = `${cartData.color}`;

  const price = document.createElement('p');
  price.innerHTML = `<span>${cartData.price}</span> €`;
  descriptionDiv.appendChild(price);
  addSettingsElement(i, cartData, contentDiv);
}

// Création d'une div "settings" pour chaque éléments du LS, contenant la quantité et le bouton 'supprimer'
function addSettingsElement(i, cartData, contentDiv) {
  const settingsDiv = document.createElement('div');
  settingsDiv.classList = 'cart__item__content__settings';
  contentDiv.appendChild(settingsDiv);

  addQuantityElement(i, settingsDiv, cartData);
  addDeleteBtnElement(cartData, settingsDiv);
}

// Ajout de la quantité pour chaque éléments du LS
function addQuantityElement(i, settingsDiv, cartData) {
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
  quantityInput.onchange = () => changeValues(i, cartData, quantityInput);
}

// Mise à jour des données dans le LS après une modification
function changeValues(i, cartData, quantityInput) {
  totalQuantity -= cartData.quantity;
  totalPrice -= cartData.price * cartData.quantity;

  cartData.quantity =
    document.querySelectorAll('.itemQuantity')[i].valueAsNumber;

  localStorage.setItem(
    quantityInput.closest('.cart__item').getAttribute('data-id') +
      ' ' +
      quantityInput.closest('.cart__item').getAttribute('data-color'),
    JSON.stringify(cartData)
  );

  calculateTotalQuantityAndPrice(cartData);
}

// Ajout d'un bouton supprimer pour chaque éléments du LS
function addDeleteBtnElement(cartData, settingsDiv) {
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

    calculateTotalQuantityAndPrice(cartData);
  };

  deleteDiv.appendChild(deleteItem);
}

// Affichage du totaux des prix et des quantités
function calculateTotalQuantityAndPrice(cartData) {
  totalQuantity += cartData.quantity;
  document.querySelector('#totalQuantity').innerText = totalQuantity;

  totalPrice += cartData.price * cartData.quantity;
  document.querySelector('#totalPrice').innerText = totalPrice;
}
// *************************** FORM *****************************

const form = document.querySelector('.cart__order__form');
const emailInput = form[4];
emailInput.onchange = () => isEmailValid();

// Vérification de la forme du email qui se fait à chaque changement de valeur dans l'input
function isEmailValid() {
  const regExpName = new RegExp(
    '^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$',
    'g'
  );
  if (!regExpName.test(emailInput.value)) {
    document.querySelector('#emailErrorMsg').innerText =
      "L'adresse Email est invalide";
  }

  postForm(form);
}

// Au clique du bouton order, envoyer une requête POST à l'API
function postForm(form) {
  form.onsubmit = () => {
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

    // Envoie de la requête POST à l'API avec la méthode fetch
    fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      body: JSON.stringify(formValues),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((dataToPost) => getOrderId(dataToPost));

    // Suppression des produit du LS après confirmation de la commande
    localStorage.clear();

    // Récupération de l'id de commande qu'on stockera par la suite dans l'URL de la page de confirmation pour le réutiliser
    function getOrderId(data) {
      document.location.href = `/front/html/confirmation.html?id=${data.orderId}`;
    }
  };
}
