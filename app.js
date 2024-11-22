import * as wppconnect from '@wppconnect-team/wppconnect';
import dotenv from 'dotenv';
import fs from 'fs-extra';
dotenv.config();
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const keyMessages = ['residencial', 'aluguel', 'luz']
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

  client.getMessages(process.env.id, {
    count: 10,
    fromMe: true
  }).then(message => {
    message.forEach((currentMessage) => {
      console.log(currentMessage.caption)
      let messageMonth = new Date(currentMessage.timestamp * 1000).getMonth();
      const currentMonth = new Date().getMonth();

      if (messageMonth == currentMonth && keyMessages.includes(currentMessage.caption)) {
        client.downloadMedia(currentMessage.id).then(downloaded => {
          let base64Image = downloaded.split(';base64,').pop();
          let name = month[currentMonth];
          
          fs.writeFile(name + ".png", base64Image, { encoding: 'base64' }, function (err) { });
          fs.move(name + ".png", '/home/pc/Documentos/Comprovantes/' + currentMessage.caption + '/' + name + ".png", function (err) {})

        })
      }
    });
  })
}
