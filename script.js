const boton = document.querySelector('#saludar');
const mensaje = document.querySelector('#mensaje');

boton.addEventListener('click', () => {
  mensaje.textContent = '¡Hola! Bienvenido al mundo de JavaScript. 👋';
});
