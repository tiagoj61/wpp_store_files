import createEvent from "../dto/createEventDto.js";
import listEvent from "../dto/listEventDto.js";

export function buildListEvent(clientData) {
    var now = new Date();
    now.setDate(now.getDate() + clientData.weekDay)
    var nowDateTime = now.toISOString();
    var nowDate = nowDateTime.split('T')[0];

    var target = new Date(nowDate + 'T' + '00:00' + ':00-00:00');
    var targetPlus = new Date(nowDate + 'T' + '23:59' + ':59-00:00');

    listEvent.timeMin = `${target.toISOString().split('.')[0] + '-00:00'}`;
    listEvent.timeMax = `${targetPlus.toISOString().split('.')[0] + '-00:00'}`;
    listEvent.calendarId = "primary"

    return listEvent;
}

export function buildCreateEvent(clientData, inputedCategories) {
    var now = new Date();
    now.setDate(now.getDate() + clientData.weekDay)
    var nowDateTime = now.toISOString();
    var nowDate = nowDateTime.split('T')[0];

    var target = new Date(nowDate + 'T' + clientData.hour + ':00-03:00');
    var targetPlus = new Date(new Date(nowDate + 'T' + clientData.hour + ':00-03:00').setMinutes(target.getMinutes() + clientData.duration));

    createEvent.summary = "Agendamento de serviço(" + clientData.service + ")";
    createEvent.location = `${process.env.LOCAL}`;
    createEvent.description = `${process.env.DESCRIPTION.replace('${barbeiro}', clientData.emp)}`;
    createEvent.start.dateTime = `${target.toISOString().split('.')[0] + '-00:00'}`;
    createEvent.end.dateTime = `${targetPlus.toISOString().split('.')[0] + '-00:00'}`;
    createEvent.colorId = 3

    createEvent.attendees = [{ "email": `${process.env.EMAIL}` }];

    return createEvent;
}
