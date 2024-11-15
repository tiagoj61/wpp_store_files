import * as calendarAuth from "../calendar/calendarAuth.js";
import * as calendarEvents from "../calendar/calendarEvents.js";
import * as processMessage from "../calendar/calendarProcessor.js";
import * as calendarBuilder from "../calendar/builder/calendarBuilder.js";

import * as repository from "../database/databaseData.js";

const className = "calendarSender";
const methodCreateEvent = "createEvent";
const methodListEvent = "listEvent";

export async function createEvent( clientData) {

  console.log(`\x1b[32m [Starting - ${className}:${methodCreateEvent}] \x1b[0m`)
  if (process.env.LCL == 'true') {
    console.log(`\x1b[34m [Menssage - clientData] - \x1b[0m`, JSON.stringify(clientData))

    var events = await listEvent(calendarBuilder.buildListEvent(clientData))
    let canCreate = canCreateEvent(clientData, events)

    return canCreate
  } else {
    var events = await listEvent(calendarBuilder.buildListEvent(clientData))
    let canCreate = canCreateEvent(clientData, events);
    clientData.emp = canCreate.emp
    var calendarMessage = calendarBuilder.buildCreateEvent(clientData, repository.inputedCategories)

    if (canCreate.isClientSelectedHour) {
      calendarAuth.authorize().then((client) => calendarEvents.createCalendarEvent(client, calendarMessage)).catch(console.error);
    }
    return canCreate;
  }
}

async function listEvent(mensage) {
  console.log(`\x1b[32m [Starting - ${className}:${methodListEvent}] \x1b[0m`)
  if (process.env.LCL == 'true') {
    console.log(`\x1b[34m [Menssage] - \x1b[0m`, JSON.stringify(mensage))
    return fakeEvent()
  } else {
    let client = await calendarAuth.authorize()
    let list = await calendarEvents.listEvents(client, mensage)
    return list
  }
}

function canCreateEvent(clientData, events) {
  return processMessage.request(clientData, events);
}

function fakeEvent() {
  let event = [
   
    {
      kind: 'calendar#event',
      etag: '"3443805663074000"',
      id: 'kfd1apjkh8gvgectfvf9o2s5p0_20240726T000000Z',
      status: 'confirmed',
      htmlLink: 'https://www.google.com/calendar/event?eid=a2ZkMWFwamtoOGd2Z2VjdGZ2ZjlvMnM1cDBfMjAyNDA3MjZUMDAwMDAwWiB0aWFnb2o2MUBt',
      created: '2024-07-25T10:20:31.000Z',
      updated: '2024-07-25T10:20:31.537Z',
      summary: 'Google I/O 2015',
      description: "Agradeçemos a escolha do nosso estabelecimento, esperamos lhe atender bem\nBarbeiro - Tiago -",
      location: '800 Howard St., San Francisco, CA 94103',
      creator: { email: 'teste', self: true },
      organizer: { email: 'teste', self: true },
      start: {
        dateTime: '2024-08-17T08:00:00-03:00',
        timeZone: 'America/Los_Angeles'
      },
      end: {
        dateTime: '2024-08-17T08:50:00-03:00',
        timeZone: 'America/Los_Angeles'
      },
      recurringEventId: 'kfd1apjkh8gvgectfvf9o2s5p0',
      originalStartTime: {
        dateTime: '2024-07-25T21:00:00-03:00',
        timeZone: 'America/Los_Angeles'
      },
      iCalUID: 'kfd1apjkh8gvgectfvf9o2s5p0@google.com',
      sequence: 0,
      attendees: [
        {
          email: 'fake',
          organizer: true,
          self: true,
          responseStatus: 'needsAction'
        }
      ],
      reminders: { useDefault: false, overrides: [[Object], [Object]] },
      eventType: 'default'
    },
    {
      kind: 'calendar#event',
      etag: '"3443805663074000"',
      id: 'kfd1apjkh8gvgectfvf9o2s5p0_20240726T000000Z',
      status: 'confirmed',
      htmlLink: 'https://www.google.com/calendar/event?eid=a2ZkMWFwamtoOGd2Z2VjdGZ2ZjlvMnM1cDBfMjAyNDA3MjZUMDAwMDAwWiB0aWFnb2o2MUBt',
      created: '2024-07-25T10:20:31.000Z',
      updated: '2024-07-25T10:20:31.537Z',
      summary: 'Google I/O 2015',
      description: "Agradeçemos a escolha do nosso estabelecimento, esperamos lhe atender bem\nBarbeiro - Tiago -",
      location: '800 Howard St., San Francisco, CA 94103',
      creator: { email: 'teste', self: true },
      organizer: { email: 'teste', self: true },
      start: {
        dateTime: '2024-08-17T14:00:00-03:00',
        timeZone: 'America/Los_Angeles'
      },
      end: {
        dateTime: '2024-08-17T14:50:00-03:00',
        timeZone: 'America/Los_Angeles'
      },
      recurringEventId: 'kfd1apjkh8gvgectfvf9o2s5p0',
      originalStartTime: {
        dateTime: '2024-07-25T21:00:00-03:00',
        timeZone: 'America/Los_Angeles'
      },
      iCalUID: 'kfd1apjkh8gvgectfvf9o2s5p0@google.com',
      sequence: 0,
      attendees: [
        {
          email: 'fake',
          organizer: true,
          self: true,
          responseStatus: 'needsAction'
        }
      ],
      reminders: { useDefault: false, overrides: [[Object], [Object]] },
      eventType: 'default'
    }


  ]
  return event
}