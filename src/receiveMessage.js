import * as step from "./message/steps.js";
import * as textWorkUtil from "./util/textWorkUtil.js";
import * as repository from "./database/databaseData.js";

let steps = new step.Steps();

export default async function processReceivedMessage(message, client) {
  console.log("\x1b[32m\n [Starting] - \x1b[0m", "Reading mensager from: " + message.sender.name)

  let clientPhone = message.from
  let actualClient = repository.clients.get(clientPhone);
  let receivedText = message.body

  if (textWorkUtil.canRecieveMessageLCL(message.sender.name, process.env.NAME) && !humanTalk(receivedText, message, client, actualClient) && !resetFlux(receivedText, message, client, actualClient)) {
    if (actualClient == null) {
      actualClient = [];
    }
    steps[step.FunctionNames[actualClient.length]](message, client, actualClient);
  }
}
function resetFlux(receivedText, message, client, actualClient) {
  let clientPhone = message.from
  let text = message.body
  if (text == '1' || timeToReset(clientPhone)) {
    repository.reset(clientPhone)
    actualClient = [];
    steps[step.FunctionNames[0]](message, client, actualClient);
    return true
  }
  return false
}
function timeToReset(clientPhone) {
  let actualHour = new Date()
  let ms = 3600000
  try {
    if (actualHour - repository.clientsTime.get(clientPhone)[0] >= ms) {

      return true
    }
  } catch (err) {

  }
  return false
}
function humanTalk(receivedText, message, client, actualClient) {
  let clientPhone = message.from
  try {
    if (repository.clients.get(clientPhone)[0].status == "stoped") {
      let actualHour = new Date()
      let ms = 3600000
      if (actualHour - repository.clients.get(clientPhone)[0].time >= ms) {
        repository.reset(clientPhone)
        return false
      } else {
        return true
      }
    }
  } catch (err) {
  }
  if (receivedText == 0) {
    steps[step.FunctionNames['stopMessages']](message, client, actualClient);
    return true
  }
  return false
}