//SpeechSynthesisUtterance() es compatible con algunos navegadores
// Revisar si es compatible con tu navegador en 
// https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance

var u = new SpeechSynthesisUtterance();

u.text = ''; // Mensaje inicial
u.lang = 'es-ES'; //Idioma de la voz dele bot (utiliza las que tengas instaladas en el navegador)
u.rate = 1.0; //Velocidad a la que habla el bot

speechSynthesis.speak(u);

//En el caso que pruebes esto en google Chrome, se necesita que agregues un boton y cuando se haga clic habilitar el bot