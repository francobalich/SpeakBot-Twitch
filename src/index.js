/* eslint no-undef: ["error", { "typeof": true }] */
// Require necesario para leer las variables de entorno del archivo .env
require('dotenv').config()
// Instanciación de los objetos necesarios para crear un servidor local con Node.JS
const express = require('express')
const path = require('path')
const port = process.env.PORT || 3000
const app = express()
const chatDialogs = require('./json/chats')
const chistes = require('./json/chistes')
// Paquete para poder crear el bot de twitch que puede recibir los mensajes del chat
const tmi = require('tmi.js')

// Instanciación de los objetos necesarios para la comunicación por Sockets
const server = require('http').createServer(app)
const io = require('socket.io')(server)

// Vamos a utilizar Axios para acceder a la API de Twitch y poder obtener los link de los Emotes
const axios = require('axios').default

// Datos de la cuenta de Twitch que utilizaran como bot que se leen el .env
// Documentación https://dev.twitch.tv/docs/irc
const options = {
  options: {
    debug: true
  },
  connection: {

  },
  identity: {
    username: process.env.USERNAME, // Nombre de usuario de la cuenta que se utilizara como bot
    password: process.env.PASSWORD // Se utiliza el oauth como contraseña
    // Para generar el oauth: https://twitchapps.com/tmi/
  },
  channels: [
    process.env.CHANNEL // Nombre de usuario de la cuenta en la que el bot leera el chat
  ]
}
// Se carga el array de las cuentas que van a ser ignoradas
const blackListJson = require('./json/blacklist')
const blackList = blackListJson.usernames
const charToDelete = blackListJson.characters

// Importa el archivo JSON con los chats para el bot

// Inicio server Node.JS
const iniciarServer = () => {
  server.listen(port, () => {
    console.log('El programa se esta ejecutando en el puerto: ' + port)
  })
  // Obtiene la ruta del directorio publico donde se encuentran los elementos estaticos (css, js).
  const publicPath = path.resolve(__dirname, '../public')
  // Para que los archivos estaticos queden disponibles.
  app.use(express.static(publicPath))

  app.get('/', function (req, res) {
    res.sendFile(__dirname + '../public/index.html')
  })
}
// Instanciamos el cliente de tmi (bot)
/* eslint new-cap: ["error", { "newIsCap": false }] */
const client = new tmi.client(options)

// SOCKETS
// Funcion que envia por sockets los datos del ultimo mensaje del chat
const refreshFront = (username, msg) => {
  io.emit('username', username)
  io.emit('text', msg)
}
// Función que envia por sockets el mensaje a leer
const hablar = async (msg, color = '#fff', username = '') => {
  let mensaje
  if (msg === '') {
    mensaje = `Escribe algo,${username}`
  } else {
    mensaje = `${username} dice ${msg}`
  }
  const data = {
    message: mensaje,
    color
  }
  const req = await JSON.stringify(data)
  io.emit('speak', req)
}

// Edita el mensaje del chat, para insertar los html necesario para agregar las imagenes de los emotes en los mensajes
const msgEdit = async (ctx, msg) => {
  if (ctx.emotes != null) {
    let msgEditado = msg
    for (const emote in ctx.emotes) {
      const linkEmote = (await getEmote(emote)).config.url
      const etiquetaEmote = `<img src="${linkEmote}" alt="emote">`

      for (const pos in ctx.emotes[emote]) {
        let inicio = 0
        let final = 0
        const posicion = ctx.emotes[emote][pos]
        inicio = posicion.split('-')[0]
        final = posicion.split('-')[1]
        const nameEmote = msg.substring(inicio, parseInt(final) + 1)
        msgEditado = msgEditado.replace(`${nameEmote}`, etiquetaEmote)
      }
    }
    return msgEditado
  } else {
    return msg
  }
}
// Función que accede a la API de Twitch
const getEmote = async (id) => {
  const apiURL = `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/light/1.0`
  const res = await axios.get(apiURL)
  return res
}

// Función que simula la tirada de una dato
function rollDice () {
  const sides = 6
  return Math.floor(Math.random() * sides) + 1
}
// Evento que se ejecuta cuando el bot se conecta al chat de Twitch
client.on('connected', () => {
  // Agregue el código que quiera que se ejecute en esta situación
})
// Evento que se ejecuta cuando se envia un mensaje en el chat
client.on('chat', async (target, ctx, message, seft) => {
  if (seft) return

  charToDelete.forEach(char => {
    message = message.replaceAll(char, '')
  })

  const mensaje = message.split(' ')
  const commandName = message.trim()
  if (commandName.substring(0, 1) === '!') {
    let msgRespuesta = chatDialogs[commandName]
    if (msgRespuesta !== undefined) {
      if (msgRespuesta.includes('&USER&')) {
        const msgOriginal = msgRespuesta.split('&')
        msgRespuesta = msgOriginal[0] + ctx.username + msgOriginal[2]
      }
      client.say(target, msgRespuesta)
    }
    if (commandName === '!dado') {
      const num = rollDice()
      client.say(target, `Sacaste un ${num}`)
    }
    if (mensaje[0] === '!speak') {
      const textoMensaje = message.replace(mensaje[0], '')
      hablar(textoMensaje, ctx.color, ctx.username)
    } if (mensaje[0] === '!chiste') {
      const longitud = Object.keys(chistes).length
      const numChiste = Math.floor(Math.random() * longitud)
      const chiste = chistes[numChiste]
      console.log(chiste)
      hablar(chiste, ctx.color)
    }
  }
  if (!blackList.includes(ctx.username)) {
    const mensajeTratado = await msgEdit(ctx, message)
    refreshFront(ctx['display-name'], mensajeTratado)
  }
  if (commandName === '!help' || commandName === '!command') {
    let comandos = ''

    Object.keys(chatDialogs).forEach(comando => {
      comandos += comando + ' - '
    })
    const ultimo = comandos.lastIndexOf(' - ')
    const comandosFijos = [' - !speak - !dado - !chiste - !help']
    comandos = comandos.substring(0, ultimo)
    client.say(
      target,
      'Los comandos disponibles son: ' + comandos + comandosFijos
    )
    console.log(target)
  }
})

// Inicia el server Node.JS
iniciarServer()
// Conecta el cliente tmi (bot)
client.connect()
