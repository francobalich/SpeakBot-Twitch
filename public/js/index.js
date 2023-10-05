/* eslint no-undef: ["error", { "typeof": true }] */
/* global io, tts */

const txtUsername = document.getElementById('txtUsername')
const txtText = document.getElementById('txtText')
const msgBox = document.getElementById('msgBox')

// La comunicacion por Sockets la realizaremos por el puerto 3000
const socket = io('http://localhost:5100/')

// Funciones
const ocultarMensaje = () => {
  msgBox.style.right = '-1000px'
}
const ttsSpeak = (message) => {
  tts.speak(message, 'es-AR', 1)
}
// Socket para el nombre de usaurio
socket.on('username', (data) => {
  txtUsername.innerHTML = data
})
// Socket para el texto del mensaje
socket.on('text', (data) => {
  msgBox.style.right = '50px'
  txtText.innerHTML = data
  setTimeout(ocultarMensaje, 7000)
})
// Sockets para el mensaje a hablar
socket.on('speak', async (data) => {
  const resp = await JSON.parse(data)
  txtUsername.style.color = resp.color
  ttsSpeak(resp.message)
})

// Sockets para la respuesta a la pregunta que le hicimos al bot
socket.on('pregunta', (data) => {
  ttsSpeak(data)
})
