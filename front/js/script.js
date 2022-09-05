// Requête GET permettant de récupérer les données des produits depuis l'API
getDataFromAPI();
async function getDataFromAPI() {
  const response = await fetch('http://localhost:3000/api/products');
  const productData = await response.json();
  addProducts(productData);
}
// Ajout des données dans la page d'accueil en suivant le template
function addProducts(data) {
  // Pour chaque produit dans le tabelau "data" :
  for (let i = 0; i < data.length; i++) {
    // créer une url
    const id = data[i]._id;
    const a = document.createElement('a');
    a.href = `./product.html?id=${id}`;
    document.querySelector('#items').appendChild(a);

    // créer un article
    const article = document.createElement('article');
    a.appendChild(article);

    // insérer l'image du produit
    const img = document.createElement('img');
    img.src = data[i].imageUrl;
    img.alt = data[i].altTxt;
    article.appendChild(img);

    // insérer le nom de produit
    const productName = data[i].name;
    const h3 = document.createElement('h3');
    h3.textContent = productName;
    h3.classList.add('productName');
    article.appendChild(h3);

    // insérer la description
    const productDescription = data[i].description;
    const p = document.createElement('p');
    p.textContent = productDescription;
    p.classList.add('productDescription');
    article.appendChild(p);
  }
}
