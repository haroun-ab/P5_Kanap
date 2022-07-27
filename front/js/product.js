//Récupération de l'ID grâce à searchParams

const id = new URLSearchParams(window.location.search).get('id');
console.log(window.location.href);
console.log(id);

let productName = '';
let priceOfProduct = 0;
let imgUrl = '';

fetch(`http://localhost:3000/api/products/${id}`)
  .then((res) => res.json())
  .then(displayOnProductPage);

function displayOnProductPage(productData) {
  //product img
  const img = document.createElement('img');
  img.src = productData.imageUrl;
  img.alt = productData.altTxt;
  document.querySelector('.item__img').appendChild(img);
  imgUrl = img.src;
  //product name
  const name = productData.name;
  document.querySelector('h1').innerText = name;
  productName = name;

  //product price
  const price = productData.price;
  document.querySelector('#price').innerText = price;
  productPrice = price;

  //product description
  const description = productData.description;
  document.querySelector('#description').innerText = description;

  //color options
  for (let i = 0; i < productData.colors.length; i++) {
    const colorOptions = document.createElement('option');
    colorOptions.innerText = productData.colors[i];
    colorOptions.value = productData.colors[i];
    document.querySelector('select').appendChild(colorOptions);
  }
}

addToCart.onclick = () => {
  let totalQuantity = Number(document.querySelector('input').value);
  const userChoice = {
    id: id,
    color: colors.value,
    quantity: totalQuantity,
    name: productName,
    price: productPrice,
    imgUrl: imgUrl,
  };

  if (userChoice.color == '' || userChoice.quantity === 0) {
    alert(`Veuillez sélectionner la couleur et la quantité souhaitées !`);
  } else {
    console.log(userChoice.color);
    let existingItem = localStorage.getItem(
      `${productName} ${userChoice.color}`
    );
    if (existingItem) {
      existingItem = JSON.parse(existingItem);
      console.log(existingItem.quantity);
      userChoice.quantity += Number(existingItem.quantity);

      localStorage.setItem(
        `${productName} ${userChoice.color}`,
        JSON.stringify(userChoice)
      );

      console.log('existe dans le LocalStorage');
    } else {
      localStorage.setItem(
        `${productName} ${userChoice.color}`,
        JSON.stringify(userChoice)
      );
      console.log("n'existe pas dans le LocalStorage");
    }
    alert(`Vous avez ajouté ${quantity.value} ${productName} au panier ! `);
  }
};
