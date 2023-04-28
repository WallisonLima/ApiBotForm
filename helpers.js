
module.exports.messageError = async function messageError(status, message, details) {
    return new Promise(async (resolve) => {
        let respAPI = {
            header: {
                status: status,
                message: message,
                details: details
            },
            response: null
        }

        resolve(respAPI)
    })
}

