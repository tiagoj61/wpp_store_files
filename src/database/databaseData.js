import * as textWorkUtil from "../util/textWorkUtil.js";

export var clients = new Map();
export var clientsTime = new Map();

export const inputedCategories = [
    { 'name': 'Barba', 'duration': 30, 'value': 'R$ 10' },
    { 'name': 'Cabelo', 'duration': 40, 'value': 'R$ 20' },
    { 'name': 'Barba e Cabelo', 'duration': 50, 'value': 'R$ 34' },
    { 'name': 'Bigode', 'duration': 20, 'value': 'R$ 46' },
    { 'name': 'Roupa', 'duration': 10, 'value': 'R$ 53' }
]
const weekDaysOriginal = [
    "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"
]

function orderDaysWeek() {
    var now = new Date();
    let days = []
    for (let i = now.getDay(); i < weekDaysOriginal.length; i++) {
        days.push(weekDaysOriginal[i])
    }
    for (let i = 0; i < now.getDay(); i++) {
        days.push(weekDaysOriginal[i])
    }
    return days;
}

export const weekDays = orderDaysWeek()

export const employers = [
    { 'name': 'Tiago' },
    { 'name': 'Joao' }
]

export function getCategories() {
    let categoriesToExternal = []
    for (let categorie of inputedCategories) {
        let categorieToExternal = {
            rowId: textWorkUtil.removeSpaces(textWorkUtil.normalizeMessage(categorie.name)),
            title: categorie.name
        }
        categoriesToExternal.push(categorieToExternal)
    }
    return categoriesToExternal
}
export function getWeekCategories() {
    let categoriesToExternal = []
    for (let categorie of weekDays) {
        let categorieToExternal = {
            rowId: categorie,
            title: categorie
        }
        categoriesToExternal.push(categorieToExternal)
    }
    return categoriesToExternal
}
export function getEmps() {
    let categoriesToExternal = []
    var emps = JSON.parse(JSON.stringify(employers))

    emps.push({ 'name': 'Sem preferência' })
    for (let categorie of emps) {
        let categorieToExternal = {
            rowId: textWorkUtil.removeSpaces(textWorkUtil.normalizeMessage(categorie.name)),
            title: categorie.name
        }
        categoriesToExternal.push(categorieToExternal)
    }
    return categoriesToExternal
}
export function getSession(key) {
    return clients.get(key)
}

export function addClient(value, key, valueToAdd) {
    value = pushIfUnique(value, valueToAdd);
    clients.set(key, value)
}
export function addClientTime(value, key, valueToAdd) {
    value = pushIfUnique(value, valueToAdd);
    clientsTime.set(key, value)
}
function pushIfUnique(value, valueToAdd) {
    if (value[valueToAdd] == null||isNumber(valueToAdd)) {
        value.push(valueToAdd);
    }
    return value
}
function isNumber(valueToAdd) {
    return /^\d+$/.test(valueToAdd)
}
export function reset(clientPhone) {
    try {
        clients.set(clientPhone, null)
        clientsTime.set(clientPhone, null)
    } catch (error) {
        console.log(error)
    }
}

export function resetClientTime(clientPhone) {
    try {
        clientsTime.set(clientPhone, null)
    } catch (error) {
        console.log(error)
    }
}