# SpeakBot-Twitch

*Este es el bot que realizamos durante los directos que hacemos en Twitch: FrancoLabs

https://www.twitch.tv/francolabs

El bot es capaz de:

* Leer el chat de Twitch
* Cuenta chistes con el comando !chiste
* Responder a comandos como (!hola, !dado y !chau)
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
    npm install dotenv
    npm install express
    npm install socket.io
    npm install speech-synthesis
    npm install tmi.js
    npm install nodemon --save-dev
```
Luego para ejecutar el programa, desde la terminal se pueden usar los siguientes scripts
```
    npm run dev (para modo desarrollador)
    npm run start (para solamente ejecutarlo)
```
## Configuración
Para configurarlo debe crear una copia del archivo .env-example llamado .env y completar los datos del mismo

Ademas dentro de la carpeta src/json puede cargar los chistes que desee en el archivo chistes.json y comandos de chat en chats.json