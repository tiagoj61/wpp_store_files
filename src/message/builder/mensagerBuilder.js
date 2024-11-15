import * as responseMessages from "../dto/responseMessagesDto.js";
import * as repository from "../../database/databaseData.js";

export function createSumary(clientData, canCreate) {
    console.log(`\x1b[34m [Menssage - canCreate] - \x1b[0m`, JSON.stringify(canCreate))

    if (canCreate.isClientSelectedHour) {
        let msg = responseMessages.sumary.replace('${week}',repository.weekDays[clientData.weekDay]).replace('${categorie}', clientData.service).replace('${hour}', canCreate.nearAvaliableHour)
        if (canCreate.emp != null) {
            msg=msg.replace('${emp}', "\n🧑 *Responsável*: " + canCreate.emp)
        } else {
            msg=msg.replace('${emp}', "")

        }
        return msg
    } else {
        let date = canCreate.nearAvaliableHour
        let dateBrazil = new Date(`${date.getFullYear()}/${("0" + (date.getMonth())).slice(-2)}/${("0" + (date.getDate())).slice(-2)} ${("0" + (date.getHours())).slice(-2)}:${("0" + (date.getMinutes())).slice(-2)}:${("0" + (date.getSeconds())).slice(-2)} -06:00`)
        let nonAvaliable = responseMessages.nonAvaliable
        let hour = canCreate.nearAvaliableHour == null ? nonAvaliable : ("0" + (dateBrazil.getHours())).slice(-2) + ":" + ("0" + (dateBrazil.getMinutes())).slice(-2)
        let msg = responseMessages.sumary_occupied.replace('${status}', canCreate.status).replace('${categorie}', clientData.service).replace('${emp}', canCreate.emp).replace('${hour}', hour)
        if (canCreate.emp != null) {
            msg=msg.replace('${emp}', "\n* 🧑 *Responsável*: " + canCreate.emp)
        } else {
            msg=msg.replace('${emp}', "")

        }
        return msg
    }
}
export function selectHourOnly(weekDay, start, end) {
    return responseMessages.selectOnlyHour.replace('${week}', weekDay).replace('${start}', start).replace('${end}', end)
}
export function selectedEmployer(categorie) {
    return responseMessages.emp.replace('${categorie}', categorie)
}
export function scheduleHour(emp,categorie, start, end) {
    let msg = responseMessages.scheduleHour.replace('${categorie}', categorie).replace('${start}', start).replace('${end}', end)
    if (emp != null) {
        msg.replace('${emp}', "\n* 🧑 *Responsável*: " + emp)
    } else {
        msg.replace('${emp}', "")
    }
    return msg
}
export function scheduleHourError(categorie, start, end) {
    return responseMessages.scheduleHourError.replace('${categorie}', categorie).replace('${start}', start).replace('${end}', end)
}
export function stopMessages() {
    return responseMessages.stopMessages
}

export function initialCategories(place, categories) {
    let categoriesToExternal = ""
    for (let categorie of categories) {
        let categorieToExternal = "* *" + categorie.name + "* - " + categorie.value + "\n"
        categoriesToExternal = categoriesToExternal + categorieToExternal
    }
    return responseMessages.initialList.replace('${stablishment}', place).replace('${services}', categoriesToExternal)
}
export function initial(place, categories,clientName) {
    let categoriesToExternal = ""
    for (let categorie of categories) {
        let categorieToExternal = "* *" + categorie.name + "* - " + categorie.value + "\n"
        categoriesToExternal = categoriesToExternal + categorieToExternal
    }
    return responseMessages.initial.replace('${name}',clientName).replace('${stablishment}', place).replace('${services}', categoriesToExternal)
}

export function initialClientData(place) {
    return responseMessages.initialClientData.replace('${stablishment}', place)
}