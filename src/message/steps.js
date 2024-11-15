import * as mensagerBuilder from "./builder/mensagerBuilder.js";
import * as calendarBuilder from "../calendar/builder/calendarBuilder.js";

import * as whatsappSender from "../proxy/whatsappSender.js";
import * as calendarSender from "../proxy/calendarSender.js";

import * as textWorkUtil from "../util/textWorkUtil.js";

import * as repository from "../database/databaseData.js";
// sabado 8h 14h pediu pra 19 sugeriu 13
export const FunctionNames = {
  0: "salutation",
  1: "showServices",
  2: "selectService",
  3: "selectedEmployer",
  4: "selectHour",
  5: "selectHour",
  'reset': "reset",
  'stopMessages': "stopMessages"
};

export class Steps {
  async salutation(message, client, actualClient) {
    try {
      let clientPhone = message.from
      let receivedText = message.body

      let messageToSend = mensagerBuilder.initialClientData(process.env.STABELI)

      whatsappSender.sendText(client, clientPhone, messageToSend)

      repository.addClient(actualClient, clientPhone, receivedText)
      repository.addClientTime([], clientPhone, new Date())

    } catch (error) {
      console.log(error)
    }
  }
  async showServices(message, client, actualClient) {
    try {
      let clientPhone = message.from
      let receivedText = message.body

      let actualSession = repository.getSession(clientPhone)
      let clientName = actualSession[0]

      let messageToSend = mensagerBuilder.initial(process.env.STABELI, repository.inputedCategories, receivedText)

      whatsappSender.sendList(client, clientPhone, messageToSend, repository.getCategories(), "Serviços")

      repository.addClient(actualClient, clientPhone, receivedText)

    } catch (error) {
      console.log(error)
    }
  }

  async selectService(message, client, actualClient) {
    try {
      let clientPhone = message.from
      let receivedText = message.body

      if (isPresentCategorie(message.body)) {

        var messageScheduled = mensagerBuilder.selectedEmployer(receivedText);
        whatsappSender.sendList(client, clientPhone, messageScheduled, repository.getEmps(), "Funcionarios")
        repository.addClient(actualClient, clientPhone, receivedText)

      } else {
        whatsappSender.sendList(client, clientPhone, mensagerBuilder.initialCategories(process.env.STABELI, repository.inputedCategories), repository.getCategories(),"Dias da semana")
      }
    } catch (error) {
      console.log(error)
    }
  }
  async selectedEmployer(message, client, actualClient) {
    try {
      let clientPhone = message.from
      let empName = isPresentEmp(message.body) ? message.body : null
      let actualSession = repository.getSession(clientPhone)
      let servName = actualSession[actualSession.length - 1]

      var messageScheduled = mensagerBuilder.scheduleHour(empName, servName, process.env.START, process.env.END);
      
      whatsappSender.sendList(client, message.from, messageScheduled,repository.getWeekCategories())
      repository.addClient(actualClient, clientPhone, empName)

    } catch (error) {
      console.log(error)
    }
  }

  async selectHour(message, client, actualClient) {
    let clientPhone = message.from
    let receivedTextClient = message.body
    let clientData = { "service": "", "hour": "", "duration": "", "emp": "", "weekDay": "" }

    let actualSession = repository.getSession(clientPhone)

    clientData.service = actualSession[2]
    clientData.emp = actualSession[3]
    clientData.weekDay = actualSession[4]==null?0:actualSession[4]
    clientData.duration = getEqualsEvent(clientData)

    try {
      if (isDayOfWeek(receivedTextClient)) {
        var messageSumary = mensagerBuilder.selectHourOnly(receivedTextClient, process.env.START, process.env.END)

        whatsappSender.sendText(client, clientPhone, messageSumary)

        repository.addClient(actualClient, clientPhone, getWeekDay(receivedTextClient))
      } else {
        let receivedText = processHourText(receivedTextClient)
        clientData.hour = receivedText

        let createEvent = await calendarSender.createEvent(clientData)

        var messageSumary = mensagerBuilder.createSumary(clientData, createEvent)

        whatsappSender.sendText(client, clientPhone, messageSumary)

        if (createEvent.isClientSelectedHour) {
          repository.reset(clientPhone)
        }
      }
    } catch (error) {
      var messageScheduled = mensagerBuilder.scheduleHourError(clientData.service, process.env.START, process.env.END);
      whatsappSender.sendText(client, clientPhone, messageScheduled)
    }
  }
  async stopMessages(message, client, actualClient) {
    let clientPhone = message.from

    repository.reset(clientPhone)

    var message = mensagerBuilder.stopMessages();
    whatsappSender.sendText(client, clientPhone, message)

    let toStore = { "status": "stoped", "time": new Date() }
    actualClient = []
    repository.addClient(actualClient, clientPhone, toStore)

  }
};
function isDayOfWeek(text) {
  for (let day of repository.weekDays) {
    if (day == text) {
      return true
    }
  }
  return false
}
function getWeekDay(text) {
  for (let i=0;i< repository.weekDays.length;i++) {
    if (repository.weekDays[i] == text) {
      return i
    }
  }
  return 0
}
function processHourText(text) {
  try {
    let parts = text.split(":")
    return parts[0].padStart(2, '0') + ":" + parts[1].padStart(2, '0')
  } catch (err) {
    throw new Error('something bad happened!');
  }
}
function isPresentCategorie(message) {
  for (let categorie of repository.inputedCategories) {
    if (textWorkUtil.normalizeMessage(message).includes(textWorkUtil.normalizeMessage(categorie.name))) {
      return true;
    }
  }
  return false;
}
export function isPresentEmp(message) {
  for (let emps of repository.employers) {
    if (textWorkUtil.normalizeMessage(message).includes(textWorkUtil.normalizeMessage(emps.name))) {
      return true;
    }
  }
  return false;
}

function getEqualsEvent(clientData) {
  for (let categorie of repository.inputedCategories) {
    if (clientData.service == categorie.name) {
      return categorie.duration
    }
  }
  return 30
}
