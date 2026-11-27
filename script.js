// Ejemplo de saludo: requiere elementos con los identificadores saludar y mensaje.
// Este archivo no se carga en index.html.
const boton = document.querySelector('#saludar');
const mensaje = document.querySelector('#mensaje');

// Cambia el mensaje cuando se presiona el botón.
boton.addEventListener('click', () => {
  mensaje.textContent = '¡Hola! Bienvenido al mundo de JavaScript. 👋';
});
