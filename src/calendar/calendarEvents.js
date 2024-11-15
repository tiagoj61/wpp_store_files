

import fss from 'fs';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';

let fs = fss.promises

export async function createCalendarEvent(auth, request) {

  const calendar = google.calendar({ version: 'v3', auth });
  const res = await calendar.events.insert({
    auth: auth,
    calendarId: 'primary',
    resource: request,
  }, function (err, event) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    console.log('Event created');
  });
}

export async function listEvents(auth, request) {
  const calendar = google.calendar({ version: 'v3', auth });
  try {
    const res = await calendar.events.list(request);
    const events = res.data.items;
    if (!events || events.length === 0) {
      console.log('No upcoming events found.');
      return null;
    }
    return events;
  } catch (err) {
    console.log(err)
    return []
  }

}

