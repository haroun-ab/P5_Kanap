let totalQuantity = 0;
let totalPrice = 0;

for (i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  let getData = JSON.parse(localStorage.getItem(key));

  createArticle(getData);
  addImage(i, getData);
  addContent(i, getData, key);
  addTotalQuantityAndPrice(i, getData);
}

function createArticle(getData) {
  const article = document.createElement('article');
  article.classList = 'cart__item';
  article.setAttribute('data-id', getData.id);
  article.setAttribute('data-color', getData.color);
  document.querySelector('#cart__items').appendChild(article);
}

function addImage(i, getData) {
  const imgDiv = document.createElement('div');
  document
    .querySelector(`#cart__items article:nth-child(${i + 1})`)
    .appendChild(imgDiv);
  imgDiv.classList = 'cart__item__img';

  const img = document.createElement('img');
  img.src = getData.imgUrl;
  img.alt = "Photographie d'un canapé";
  imgDiv.appendChild(img);
}

function addContent(i, getData, key) {
  const contentDiv = document.createElement('div');
  document
    .querySelector(`#cart__items article:nth-child(${i + 1})`)
    .appendChild(contentDiv);
  contentDiv.classList = 'cart__item__content';

  addDescription(i, getData, contentDiv, key);
}

function addDescription(i, getData, contentDiv, key) {
  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList = 'cart__item__content__description';
  contentDiv.appendChild(descriptionDiv);

  const name = document.createElement('h2');
  name.innerText = getData.name;
  descriptionDiv.appendChild(name);

  const color = document.createElement('p');
  descriptionDiv.appendChild(color);
  color.innerText = `${getData.color}`;

  const price = document.createElement('p');
  price.innerHTML = `<span>${getData.price}</span> €`;
  //price.classList = 'itemPrice';
  descriptionDiv.appendChild(price);
  addSettings(i, getData, contentDiv, key);
}

function addSettings(i, getData, contentDiv, key) {
  const settingsDiv = document.createElement('div');
  settingsDiv.classList = 'cart__item__content__settings';
  contentDiv.appendChild(settingsDiv);

  addQuantity(i, settingsDiv, getData, key);
  addDelete(settingsDiv, key);
}

function addQuantity(i, settingsDiv, getData, key) {
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
  quantityInput.value = getData.quantity;
  quantityInput.setAttribute('value', getData.quantity);

  quantityInput.addEventListener('change', (e) =>
    changeValues(e, i, key, getData, quantityInput)
  );

  quantityDiv.appendChild(quantityInput);
}
function changeValues(e, i, key, getData, quantityInput) {
  getData.quantity = quantityInput.value;

  //document.querySelectorAll('.itemQuantity')[i].valueAsNumber;

  addTotalQuantityAndPrice(i, getData);
}

function addDelete(settingsDiv, key) {
  const deleteDiv = document.createElement('div');
  deleteDiv.classList = 'cart__item__content__settings__delete';
  settingsDiv.appendChild(deleteDiv);

  const deleteItem = document.createElement('p');
  deleteItem.classList = 'deleteItem';
  deleteItem.innerText = 'Supprimer';

  deleteItem.onclick = () => {
    localStorage.removeItem(key);
    document.location.reload();
  };
  deleteDiv.appendChild(deleteItem);
}

function addTotalQuantityAndPrice(i, getData) {
  totalQuantity += document.querySelectorAll('.itemQuantity')[i].valueAsNumber;
  document.querySelector('#totalQuantity').innerText = totalQuantity;

  totalPrice +=
    getData.price * document.querySelectorAll('.itemQuantity')[i].valueAsNumber;

  document.querySelector('#totalPrice').innerText = totalPrice;
}
