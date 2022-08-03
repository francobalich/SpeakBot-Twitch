// Require necesario para leer las variables de entorno del archivo .env
require("dotenv").config();
// Instanciación de los objetos necesarios para crear un servidor local con Node.JS
const express = require('express');
const path = require('path');
const port = process.env.PORT;
const app = express();

// Paquete para poder crear el bot de twitch que puede recibir los mensajes del chat
const tmi = require("tmi.js");

// Instanciación de los objetos necesarios para la comunicación por Sockets
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//Vamos a utilizar Axios para acceder a la API de Twitch y poder obtener los link de los Emotes
const axios = require('axios').default;

// Datos de la cuenta de Twitch que utilizaran como bot que se leen el .env
// Documentación https://dev.twitch.tv/docs/irc
const options= {
    options:{
        debug:true
    },
    connection:{
        
    },
    identity: {
        username: process.env.USERNAME,//Nombre de usuario de la cuenta que se utilizara como bot
        password: process.env.PASSWORD //Se utiliza el oauth como contraseña
        // Para generar el oauth: https://twitchapps.com/tmi/
      },
      channels: [
        process.env.CHANNEL //Nombre de usuario de la cuenta en la que el bot leera el chat
      ]
};

// Inicio server Node.JS
const iniciarServer=()=>{
  server.listen(port,()=>{
    console.log("El programa se esta ejecutando en el puerto: "+ port)
  });
  // Obtiene la ruta del directorio publico donde se encuentran los elementos estaticos (css, js).
  var publicPath = path.resolve(__dirname, '../public'); 
  // Para que los archivos estaticos queden disponibles.
  app.use(express.static(publicPath));
  
  app.get('/', function(req, res){
    res.sendFile(__dirname + '../public/index.html');
  });
}
// Instanciamos el cliente de tmi (bot)
const client = new tmi.client(options);

// SOCKETS
// Funcion que envia por sockets los datos del ultimo mensaje del chat
const refreshFront=(username,msg)=>{
  io.emit("username",username);
  io.emit("text",msg);
}
// Función que envia por sockets el mensaje a leer 
const hablar=(username,msg)=>{
  let mensaje;
  if(msg==''){
    mensaje =`Escribe algo,${username}`;
  }
  else{
    mensaje =`${username} dice ${msg}`;
  }
  io.emit("speak",`${mensaje}`);
}
// Función que envia por sockets la respuesta a la pregunta que le hicimos al bot
const preguntar=(username,msg)=>{
  let mensaje =`${username}, Soy el bot que les da ordenes`
  io.emit("pregunta",`${mensaje}`);
}

// Edita el mensaje del chat, para insertar los html necesario para agregar las imagenes de los emotes en los mensajes
const msgEdit= async(ctx,msg)=>{
  if (ctx.emotes!=null){
    var msgEditado=msg;
    for (const emote in ctx.emotes) {
      const linkEmote = (await getEmote(emote)).config.url;
      const etiquetaEmote =`<img src="${linkEmote}" alt="emote">`
      
      for (const pos in ctx.emotes[emote]) {
        let inicio=0;
        let final=0;
        let posicion =ctx.emotes[emote][pos];
        inicio=posicion.split('-')[0];
        final=posicion.split('-')[1];
        let nameEmote= msg.substring(inicio,parseInt(final)+1);
        msgEditado=msgEditado.replace(`${nameEmote}`,etiquetaEmote);
      }
    }
    return msgEditado;
  }
  else{
    return msg;
  }
}
// Función que accede a la API de Twitch
const getEmote = async (id) =>{
  const apiURL = `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/light/1.0`;
  const res= await axios.get(apiURL);
  return res;
}

// Función que simula la tirada de una dato
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}
// Evento que se ejecuta cuando el bot se conecta al chat de Twitch
client.on('connected', ()=>{
  // Agregue el código que quiera que se ejecute en esta situación
});
// Evento que se ejecuta cuando se envia un mensaje en el chat
client.on("chat",async(target,ctx,message,seft)=>{
    if(seft)return;
    let mensaje= message.split(' ');
    const commandName = message.trim()
    if(commandName==="!hola"){
        client.say(target, `Bienvenido ${ctx.username}`)
    }
    if(commandName==="!streamdeck"){
      client.say(target,`No esta funcionando, ahora es un destructor de drivers de teclado`)
    }
    if(commandName==="!proyectos"){
      client.say(target,`Actualmente estamos trabajando en un StreamDeck con Arduino, un bot de Twitch e integrando robots al chat`)
    }
    if(commandName==="!dado"){
      let num = rollDice();
      client.say(target,`Sacaste un ${num}`);
    }
    if(mensaje[0]==="!speak"){
      let textoMensaje=message.replace(mensaje[0],'');
      hablar(ctx.username,textoMensaje);
    }
    if(message==="!¿Quien es ese bot?"){
      preguntar(ctx.username,message);
    }

    if(ctx.username!="streamelements"){
      const mensajeTratado= await msgEdit(ctx,message);
      refreshFront(ctx.username,mensajeTratado);
    } 
})

// Inicia el server Node.JS
iniciarServer();
// Conecta el cliente tmi (bot)
client.connect();

