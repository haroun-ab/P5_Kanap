fetch('http://localhost:3000/api/products')
  .then((res) => res.json())
  .then((data) => productData(data));

const productData = function (data) {
  let a = document.createElement('a');
  const IMAGEURL = data[1].imageUrl;
  a.href = IMAGEURL;
  a.text = 'first sofa';
  const items = document.querySelector('#items');
  items.appendChild(a);
};
