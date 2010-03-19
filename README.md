# node-shoutbox

This is a simple app demonstrating the event based nature of [node.js](http://github.com/ry/node). It uses [long-polling](http://en.wikipedia.org/wiki/Push_technology#Long_polling) to deliver new comments to the client as they arrive.

## Running

Ensure you are running node >= v0.1.31 then run the following command:

	node ./shoutbox.js

Browse to [http://0.0.0.0:8080/](http://0.0.0.0:8080/) and add your comments. For maximum geekage open the app in multiple browser windows :)
