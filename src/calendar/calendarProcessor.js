
import * as repository from "../database/databaseData.js";

const className = "processMessage";
const methodRequest = "request";

export function request(clientData, dayCalendarEventsRemote) {
    let employer = clientData.emp
    let dayCalendarEvents = orderEvents(dayCalendarEventsRemote)

    let grouped = groupByEmploier(dayCalendarEvents, employer)

    console.log(`\x1b[32m [Starting - ${className}:${methodRequest}] \x1b[0m`)

    var establishmentWorkHour = getEstablishmentWorkHour(clientData)
    console.log(`\x1b[34m [Menssage - establishmentWorkHour] - \x1b[0m`, JSON.stringify(establishmentWorkHour))

    let clientHour = generateClientDateBr(clientData)
    var statusHour = { 'status': 'Horario disponivel', 'clientHourSelected': clientData.hour, 'nearAvaliableHour': clientData.hour, 'isClientSelectedHour': true, "emp": employer }

    if (employer == null) {//Tem que ser diferente se naquele horairo alguem tiver, tem que trocar
        let disp = 0;
        let empFree;
        for (let empWorkDay of grouped) {
            dayCalendarEvents = empWorkDay[1]

            if (isEstablishmentWorkHour(clientHour, establishmentWorkHour)) {
                return { 'status': 'Horario não disponivel, estabelecimento fechado', 'clientHourSelected': clientData.hour, 'nearAvaliableHour': nearAvaliableHour(clientHour, dayCalendarEvents, establishmentWorkHour, employer), 'isClientSelectedHour': false }
            }
            if (dayCalendarEvents != null && dayCalendarEvents.length > 0) {
                let dispStar = disp
                for (let i = 0; i < dayCalendarEvents.length; i++) {
                    if (!isBetWeen(clientHour, dayCalendarEvents[i])) {
                        statusHour = { 'status': 'Horario não disponivel', 'clientHourSelected': clientData.hour, 'nearAvaliableHour': "", 'isClientSelectedHour': false }
                        disp++;
                    }
                }
                if (disp > dispStar + 1) {
                    disp = dispStar + 1
                }
                if (dispStar == disp) {
                    empFree = empWorkDay[0]
                }
            }
            if (statusHour.isClientSelectedHour == false) {
                let pe = nearAvaliableHour(clientHour, dayCalendarEvents, establishmentWorkHour, employer)
                statusHour.nearAvaliableHour = pe
            }
        }
        if (grouped.size != repository.employers) {
            let keys = Array.from(grouped.keys());
            for (let empWorkDay of repository.employers) {
                if (!keys.includes(empWorkDay.name)) {
                    empFree = empWorkDay.name
                }
            }
        }
        if (disp < repository.employers.length) {// TODO: Falta o nome de quem vai fazer
            statusHour = { 'status': 'Horario disponivel', 'clientHourSelected': clientData.hour, 'nearAvaliableHour': clientData.hour, 'isClientSelectedHour': true, "emp": empFree }
        }
    } else {
        dayCalendarEvents = grouped.get(employer)

        if (isEstablishmentWorkHour(clientHour, establishmentWorkHour)) {
            return { 'status': 'Horario não disponivel, estabelecimento fechado', 'clientHourSelected': clientData.hour, 'nearAvaliableHour': nearAvaliableHour(clientHour, dayCalendarEvents, establishmentWorkHour, employer), 'isClientSelectedHour': false }
        }
        if (dayCalendarEvents != null && dayCalendarEvents.length > 0) {
            for (let i = 0; i < dayCalendarEvents.length; i++) {
                if (!isBetWeen(clientHour, dayCalendarEvents[i])) {
                    statusHour = { 'status': 'Horario não disponivel', 'clientHourSelected': clientData.hour, 'nearAvaliableHour': "", 'isClientSelectedHour': false }
                }
            }
        }
        if (statusHour.isClientSelectedHour == false) {
            let pe = nearAvaliableHour(clientHour, dayCalendarEvents, establishmentWorkHour, employer)
            statusHour.nearAvaliableHour = pe
        }
    }
    return statusHour

}
function orderEvents(dayCalendarEvents) {
    if (dayCalendarEvents != null) {
        for (let i = 0; i < dayCalendarEvents.length; i++) {
            for (let j = i + 1; j < dayCalendarEvents.length; j++) {
                let eventInitiJ = generateDateBr(new Date(dayCalendarEvents[j].start.dateTime))
                let eventInitiI = generateDateBr(new Date(dayCalendarEvents[i].start.dateTime))
                if (eventInitiI > eventInitiJ) {
                    let aux = dayCalendarEvents[i];
                    dayCalendarEvents[i] = dayCalendarEvents[j];
                    dayCalendarEvents[j] = aux;
                }
            }
        }
    }
    return dayCalendarEvents


}
function getEstablishmentWorkHour(clientData) {
    var now = new Date();
    now.setDate(now.getDate() + clientData.weekDay)
    var nowDateTime = now.toISOString();
    var nowDate = nowDateTime.split('T')[0];

    var establishmentDateStart = generateDateBr(new Date(nowDate + 'T' + process.env.START + ':00' + '.00-0300'));
    var establishmentDateEnd = generateDateBr(new Date(nowDate + 'T' + process.env.END + ':00' + '.00-0300'));

    return { start: process.env.START + ':00', end: process.env.END + ':00', startDate: establishmentDateStart, endDate: establishmentDateEnd }
}

function isEstablishmentWorkHour(clientHour, establishmentWorkHour) {
    return clientHour.targetIniti < establishmentWorkHour.startDate || clientHour.targetEnd > establishmentWorkHour.endDate
}
function isBetWeen(clientHour, calendar) {

    let eventIniti = generateDateBr(new Date(calendar.start.dateTime))
    let eventEnd = generateDateBr(new Date(calendar.end.dateTime))


    return (clientHour.targetIniti < eventIniti && clientHour.targetEnd <= eventIniti) || (clientHour.targetIniti >= eventEnd && clientHour.targetEnd > eventEnd);
}
function generateDateBr(date) {
    return new Date(`${date.getFullYear()}/${("0" + (date.getMonth())).slice(-2)}/${("0" + (date.getDate())).slice(-2)} ${("0" + (date.getHours())).slice(-2)}:${("0" + (date.getMinutes())).slice(-2)}:${("0" + (date.getSeconds())).slice(-2)} -00:00`)
}
function generateClientDateBr(clientData) {
    var now = new Date();
    now.setDate(now.getDate() + clientData.weekDay)
    var nowDateTime = now.toISOString();
    var nowDate = nowDateTime.split('T')[0];

    var target = new Date(nowDate + 'T' + clientData.hour + ':00-03:00');
    var targetPlus = new Date(new Date(nowDate + 'T' + clientData.hour + ':00-03:00').setMinutes(target.getMinutes() + clientData.duration));

    let targetIniti = generateDateBr(target)
    let targetEnd = generateDateBr(targetPlus)
    return { "targetIniti": targetIniti, "targetEnd": targetEnd, "duration": targetEnd - targetIniti }
}

function getDuration(calendar) {
    return new Date(calendar.end.dateTime) - new Date(calendar.start.dateTime);
}
function groupByEmploier(dayCalendarEvents, employer) {
    let gouped = new Map()
    if (dayCalendarEvents != null) {
        for (let i = 0; i < dayCalendarEvents.length; i++) {
            let desc = dayCalendarEvents[i].description
            let emp = desc.substring(
                desc.indexOf("- ") + 1,
                desc.lastIndexOf(" -")
            ).trim();
            let events = gouped.get(emp)
            if (events == null) {
                events = []
            }
            events.push(dayCalendarEvents[i])
            gouped.set(emp, events)
        }
    }
    return gouped
}
function nearAvaliableHour(clientHourSelected, dayCalendarEvents, establishmentWorkHour, employer) {

    if (dayCalendarEvents == null || dayCalendarEvents.length == 0) {
        return nearHour(clientHourSelected, establishmentWorkHour.endDate, establishmentWorkHour.startDate)
    }
    let j
    let near = generateDateBr(new Date(dayCalendarEvents[0].start.dateTime))
    for (let i = 0; i < dayCalendarEvents.length; i++) {
        let eventIniti = generateDateBr(new Date(dayCalendarEvents[i].start.dateTime))

        let sugestedNear = Math.abs(eventIniti - clientHourSelected.targetIniti)
        if (Math.abs(near - clientHourSelected.targetIniti) >= sugestedNear) {
            near = eventIniti;
            j = i
        }
    }
    var n
    var p
    for (let i = 0; i < dayCalendarEvents.length; i++) {
        let eventIniti = generateDateBr(new Date(dayCalendarEvents[i].start.dateTime))
        let eventEnd = generateDateBr(new Date(dayCalendarEvents[i].end.dateTime))
        if (i == 0) {
            if (n == null || Math.abs(i - j) < Math.abs(p - j)) {
                if ((Math.abs(eventIniti - establishmentWorkHour.startDate)) >= clientHourSelected.duration) {
                    n = nearHoursss(clientHourSelected, establishmentWorkHour.startDate, eventIniti)
                    p = i
                }
            }
            if (i + 1 < dayCalendarEvents.length) {
                let nextEventIniti = generateDateBr(new Date(dayCalendarEvents[i + 1].start.dateTime))
                if (n == null || Math.abs(i - j) < Math.abs(p - j)) {
                    if ((Math.abs(eventEnd - nextEventIniti)) >= clientHourSelected.duration) {
                        n = nearHour(clientHourSelected, nextEventIniti, eventEnd)
                        p = i
                    }
                }
            } else {
                let differenceHourInit = Math.abs(clientHourSelected.targetIniti - establishmentWorkHour.startDate) > Math.abs(clientHourSelected.targetEnd - establishmentWorkHour.endDate)
                if (n == null || Math.abs(i - j) < Math.abs(p - j) || differenceHourInit) {
                    if ((Math.abs(eventEnd - establishmentWorkHour.endDate)) >= clientHourSelected.duration) {
                        n = nearHours(clientHourSelected, establishmentWorkHour.endDate, eventEnd)
                        p = i
                    }
                }
            }

        } else if (i == dayCalendarEvents.length - 1) {
            if (n == null || Math.abs(i - j) < Math.abs(p - j)) {
                if ((Math.abs(eventEnd - establishmentWorkHour.endDate)) >= clientHourSelected.duration) {
                    n = nearHours(clientHourSelected, establishmentWorkHour.endDate, eventEnd)
                    p = i
                }
            }
        } else {
            let nextEventIniti = generateDateBr(new Date(dayCalendarEvents[i + 1].start.dateTime))
            if (n == null || Math.abs(i - j) < Math.abs(p - j)) {
                if ((Math.abs(eventEnd - nextEventIniti)) >= clientHourSelected.duration) {
                    n = nearHour(clientHourSelected, nextEventIniti, eventEnd)
                    p = i
                }
            }
        }
    }
    return n
}
function nearHour(clientHourSelected, establishsSartDate, eventIniti) {
    let differenceHourInit = Math.abs(clientHourSelected.targetIniti - establishsSartDate)
    let differenceHourEnd = Math.abs(clientHourSelected.targetIniti - eventIniti)

    establishsSartDate.setMinutes(establishsSartDate.getMinutes() - millisToMinutesAndSeconds(clientHourSelected.duration))

    return differenceHourInit < differenceHourEnd ? establishsSartDate : eventIniti
}
function nearHours(clientHourSelected, establishsSartDate, eventIniti) {
    let differenceHourInit = Math.abs(clientHourSelected.targetIniti - establishsSartDate)
    let differenceHourEnd = Math.abs(clientHourSelected.targetIniti - eventIniti)

    establishsSartDate.setMinutes(establishsSartDate.getMinutes() - millisToMinutesAndSeconds(clientHourSelected.duration))

    return differenceHourInit < differenceHourEnd ? establishsSartDate : eventIniti
}
function nearHoursss(clientHourSelected, establishsSartDate, eventIniti) {
    let differenceHourInit = Math.abs(clientHourSelected.targetIniti - establishsSartDate)
    let differenceHourEnd = Math.abs(clientHourSelected.targetIniti - eventIniti)

    eventIniti.setMinutes(eventIniti.getMinutes() - millisToMinutesAndSeconds(clientHourSelected.duration))

    return differenceHourInit < differenceHourEnd ? establishsSartDate : eventIniti
}
function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    return minutes;
}