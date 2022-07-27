fetch('http://localhost:3000/api/products') // 1. On fetch les données
  .then((res) => res.json())
  .then((data) => addProduct(data)); // 2. puis on les passe à la fonction addProduct

function addProduct(data) {
  for (let i = 0; i < data.length; i++) {
    // 3. qui grâce à une boucle, va reproduire le template dans le HTML en utilisant les données de l'API

    //link
    const id = data[i]._id;
    const a = document.createElement('a');
    a.href = `./product.html?id=${id}`;
    document.querySelector('#items').appendChild(a);

    //article
    const article = document.createElement('article');
    a.appendChild(article);

    //image
    const img = document.createElement('img');
    img.src = data[i].imageUrl;
    img.alt = data[i].altTxt;
    article.appendChild(img);

    //h3
    const productName = data[i].name;
    const h3 = document.createElement('h3');
    h3.textContent = productName;
    h3.classList.add('productName');
    article.appendChild(h3);

    //p
    const productDescription = data[i].description;
    const p = document.createElement('p');
    p.textContent = productDescription;
    p.classList.add('productDescription');
    article.appendChild(p);
  }
}
