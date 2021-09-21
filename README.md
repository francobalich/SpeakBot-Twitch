# SpeakBot-Twitch

*Este es el bot que realizamos durante los directos que hacemos en Twitch: FrancoLabs

https://www.twitch.tv/francolabs

El bot es capaz de:

* Leer el chat de Twitch
* Responder a comandos como (!hola, !dado, !,streamdeck y !proyectos)
* Puede reproducir por medio de audio los mensajes que envíen en el chat usando !speak
* Muestra en una ventana emergente el último mensaje del chat
* Carga las imágenes de los emotes usados en el chat.

Este Bot utiliza la API de Twitch para los emotes y tmi.js para leer el chat de Twitch
Además, usa el paquete npm "speech-synthesis" para convertir texto a audio.

## Instalación
Una vez descargado ejecutar:
```
    npm install .
```
o sino ejecutar los siguientes comandos:
```
    npm install axios
    npm install express
    npm install nodemon
    npm install socket.io
    npm install speech-synthesis
    npm install tmi.js
```
Luego para ejecutar el programa, desde la terminal se pueden usar los siguientes scripts
```
    npm run dev (para modo desarrollador)
    npm run start (para solamente ejecutarlo)
```