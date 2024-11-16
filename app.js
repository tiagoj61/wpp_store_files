import * as wppconnect from '@wppconnect-team/wppconnect';
import dotenv from 'dotenv';

import processReceivedMessage from "./src/receiveMessage.js";

dotenv.config();

console.log("\x1b[32m [Starting] - \x1b[0m", "Application with ENV: " + process.env.LCL)

wppconnect
  .create({
    session: 'session2',
    catchQR: (base64Qr, asciiQR) => {
      console.log(asciiQR); // Optional to log the QR in the terminal
      var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }
      response.type = matches[1];
      response.data = new Buffer.from(matches[2], 'base64');

      var imageBuffer = response;
      require('fs').writeFile(
        './util/out.png',
        imageBuffer['data'],
        'binary',
        function (err) {
          if (err != null) {
            console.log(err);
          }
        }
      );
    },
    logQR: false,
  })
  .then((client) => start(client))
  .catch((error) => console.log(error));

async function start(client) {
  
  client.getUnreadMessages(true,true,true).then(a=>console.log(a))
 
}
