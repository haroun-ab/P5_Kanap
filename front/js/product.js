// Récupération de l'ID grâce à searchParams
const id = new URLSearchParams(window.location.search).get('id');

let productName = '';
let priceOfProduct = 0;
let imgUrl = '';
getDataFromAPI();

// Requête GET permettant de récupérer des données pour chaque produit depuis l'API grâce à leur ID
async function getDataFromAPI() {
  const response = await fetch(`http://localhost:3000/api/products/${id}`);
  const productData = await response.json();
  displayOnProductPage(productData);
}
function displayOnProductPage(productData) {
  // Ajout de l'image du produit
  const img = document.createElement('img');
  img.src = productData.imageUrl;
  img.alt = productData.altTxt;
  document.querySelector('.item__img').appendChild(img);
  imgUrl = img.src;
  // Ajout du nom du produit
  const name = productData.name;
  document.querySelector('h1').innerText = name;
  productName = name;
  // Utilisation du nom du produit comme titre de la page
  const title = document.querySelector('html title');
  title.innerText = productName;
  // Ajout du prix produit
  const price = productData.price;
  document.querySelector('#price').innerText = price;
  productPrice = price;

  // Ajout de la description du produit
  const description = productData.description;
  document.querySelector('#description').innerText = description;

  // Ajout des options de couleur
  for (let i = 0; i < productData.colors.length; i++) {
    const colorOptions = document.createElement('option');
    colorOptions.innerText = productData.colors[i];
    colorOptions.value = productData.colors[i];
    document.querySelector('select').appendChild(colorOptions);
  }
  addToCart.onclick = () => saveOnLocalStorage();
}

// Au clique sur le bouton "ajouter au panier", enregistrer la commande sur le localStorage
function saveOnLocalStorage() {
  let totalQuantity = Number(document.querySelector('input').value);

  const userChoice = {
    id: id,
    color: window.colors.value,
    quantity: totalQuantity,
  };

  // Si les deux paramètres n'ont pas été sélectionnés, envoyer une alerte
  if (userChoice.color == '' || userChoice.quantity <= 0) {
    alert(`Veuillez sélectionner la couleur et la quantité souhaitées !`);
  } // Si le produit est déja présent dans le localStorage, la nouvelle quantité sélectionné s'ajoute à l'ancienne
  else {
    let existingItem = JSON.parse(
      localStorage.getItem(`${userChoice.id} ${userChoice.color}`)
    );
    if (existingItem) {
      userChoice.quantity += Number(existingItem.quantity);

      localStorage.setItem(
        `${userChoice.id} ${userChoice.color}`,
        JSON.stringify(userChoice)
      );
    } else {
      localStorage.setItem(
        `${userChoice.id} ${userChoice.color}`,
        JSON.stringify(userChoice)
      );
    }
    alert(
      `Vous avez désormais ${userChoice.quantity} ${productName} dans le panier ! `
    );
  }
}
