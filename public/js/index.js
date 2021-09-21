const txtUsername = document.getElementById("txtUsername");
const txtText = document.getElementById("txtText");
const mensajes = document.getElementById("mensajes");
const msgBox= document.getElementById("msgBox");
//La comunicacion por Sockets la realizaremos por el puerto 3000
const socket = io("http://localhost:3000/");

let u = new SpeechSynthesisUtterance();
u.text = '';
u.lang = 'es-ES';
u.rate = 1; 

//Funciones
const enviarMensaje=(etiqueta,mensaje)=>{
    socket.emit(etiqueta,mensaje);
}
const ocultarMensaje=()=>{
    console.log("Fin timer")
    msgBox.style.width="0px";
}

//Socket para el nombre de usaurio
socket.on('username', (data)=>{
    txtUsername.innerHTML = data;
});
//Socket para el texto del mensaje
socket.on('text', (data)=>{
    msgBox.style.width="600px";
    txtText.innerHTML = data;
    setTimeout(ocultarMensaje, 10000);
});
//Sockets para recibir el html del emote
socket.on('emote', (data)=>{
    emoteContainer.innerHTML =data;
}); 

//Sockets para el mensaje a hablar
socket.on('speak', (data)=>{
    u.text = data;
    speechSynthesis.speak(u);
});
//Sockets para la respuesta a la pregunta que le hicimos al bot
socket.on('pregunta', (data)=>{
    u.text = data;
    speechSynthesis.speak(u);
});
