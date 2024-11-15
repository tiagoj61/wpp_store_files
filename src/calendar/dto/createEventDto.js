const createEvent = {
    "summary": '',
    "location": '',
    "description": '',
    "colorId":1,
    "start": {
      "dateTime": '',
      "timeZone": "America/Sao_Paulo"},
    "end": {
      "dateTime": '',
      "timeZone": "America/Sao_Paulo"
    },
    "recurrence": [
      "RRULE:FREQ=DAILY;COUNT=1"
    ],
    "attendees": [
      {"email": ''}
    ],
    "reminders": {
      "useDefault": false,
      "overrides": [
        {"method": "email", "minutes": 24},
        {"method": "popup", "minutes": 10}
      ]
    }
  };

export default createEvent;