// Récupérer l'id de la commande dans les paramètre de l'URL
const orderId = new URLSearchParams(window.location.search).get('id');

// Insérer l'id dans la page confirmation
document.querySelector('#orderId').innerText = orderId;

const thanks = document.createElement('span');
thanks.innerText = 'Merci pour votre confiance et à bientôt !';
document.querySelector('.confirmation p').appendChild(thanks);
