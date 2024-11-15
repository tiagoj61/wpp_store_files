
export function isDigit(message) {
    return /\d/.test(normalizeMessage(message.body))
}

export function normalizeMessage(text) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
}

export function removeSpaces(text) {
    return text.replace(/\s/g, '')
}

export function messageIncludesOther(mensager, text) {
    return normalizeMessage(mensager).includes(normalizeMessage(text))
}
export function canRecieveMessageLCL(mensager, text) {
    let list = text.split(",")
    for (let isolated of list) {
        if (messageIncludesOther(mensager, isolated)){
            return true
        }
    }
    return false
}

export function padAnyString(text) {
    return ("0" + (text)).slice(-2)
}