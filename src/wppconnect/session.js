import * as wppconnect from '@wppconnect-team/wppconnect';
export async function create(sessionName, storePath) {
    let ERRO_BASEQR = 'Invalid input string.'
    let ERRO_STOREQR = 'Error storing file.'
    wppconnect
        .create({
            session: sessionName,
            catchQR: (base64Qr, asciiQR) => {
                console.log(asciiQR);
                var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
                    response = {};
                if (matches.length !== 3) {
                    return new Error(ERRO_BASEQR);
                }
                response.type = matches[1];
                response.data = new Buffer.from(matches[2], 'base64');

                var imageBuffer = response;
                require('fs').writeFile(
                    storePath,
                    imageBuffer['data'],
                    'binary',
                    function (err) {
                        if (err != null) {
                            console.log(ERRO_STOREQR);
                        }
                    }
                );
            },
            logQR: false,
        })
        .then((client) => { return client })
        .catch((error) => console.log(error));
}