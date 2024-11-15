const className = "whatsappSender";
const methodSendText = "sendText";
const methodSendList = "sendList";

export function sendText(client, to, mensage) {
    console.log(`\x1b[32m [Starting - ${className}:${methodSendText}] \x1b[0m`)
    if (process.env.LCL == 'true') {
        console.log(`\x1b[34m [Menssage] - \x1b[0m`, JSON.stringify(mensage))
    } else {
        client.sendText(to, mensage);
    }
}

export function sendList(client, to, mensage, rows,title) {
    console.log(`\x1b[32m [Starting - ${className}:${methodSendList}] \x1b`)

    if (process.env.LCL == 'true') {
        console.log(`\x1b[34m [Menssage] - \x1b[0m`, JSON.stringify(mensage))
    } else {
        client.sendListMessage(to, {
            buttonText: '👉 SELECIONE UMA 👈',
            description: mensage,
            sections: [
                {
                    title: title,
                    rows: rows,
                },
            ],
        });
    }
}