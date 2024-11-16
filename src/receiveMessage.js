import * as textWorkUtil from "./util/textWorkUtil.js";

export default async function processReceivedMessage(message, client) {
  console.log("\x1b[32m\n [Starting] - \x1b[0m", "Reading mensager from: " + message.sender.name)

  if (textWorkUtil.canRecieveMessageLCL(message.sender.name, 'MEU-GRUPO')) {
    console.log(message.body)
  }
}