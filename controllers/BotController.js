const help = require("../helpers")
// const db = require('../database');
const tokenAuthorization = "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBUEkgRHJNb2JpbGUgR2F0ZUtlZXBlciIsInN1YiI6IjIiLCJpYXQiOjE2ODI3MTcxNTQsImV4cCI6MTY4MjgwMzU1NH0.5Bs2t0QyGo8mn5nDucgn_Z5-RtlVf1l8bfaq2oHBX6YDRMOBILE";
const botService = require('../services/botService')

class BotForm {
    async post(req, res) {

        // await db.insertDB('users', req.body)
        console.log(req.body)

        let resp = await validToken(req.headers.authorization)
        if (resp) {
            res.send(resp);
            return;
        }

        resp = await validReq(req.body)
        if (resp) {
            res.send(resp)
            return;
        }


        const dados = {
            nome: req.body.nome,
            sobreNome: req.body.sobreNome,
            email: req.body.email,
            cargo: req.body.cargo,
            departamento: req.body.departamento,
            empresa: req.body.empresa,
            siteEmpresa: req.body.siteEmpresa
        }

        let page = await botService.launch();
        if (!page) {
            resolve(await help.messageError(500, 'Browser default', ''))
            return;
        }

        page = await botService.insereDadosParceiro(page);

        page = await botService.insereDadosIndicado(page, dados);

        page = await botService.selecionaDadosIndicado(page, dados);

        page = await botService.clickBoxIndicado(page, dados);

        // await clickByAttr(page, "type", "submit")

    }

}


module.exports = new BotForm();



async function main(req) {
    return new Promise(async (resolve, reject) => {

        if (!req.body) {
            resolve(await help.messageError(3, 'Error com a requisição', 'Contate o suporte LeadsOK.'))
            return;
        }

        let launchResp = await bradescoService.launch();

        let tim2 = setTimeout(async function () {
            let hour = moment.tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm')
            console.log(`Bradesco fechado por temporizador ${hour} `)
            launchResp.browser.close()
            clearInterval(tim2);
            resolve(await help.messageError(3, 'tempo de 10 minutos excedido', 'Processo travado'));
            return;
        }, constants.time);

        if (!launchResp) {
            resolve(await help.messageError(3, 'Error com a requisição', 'Contate o suporte LeadsOK.'))
            // launchResp.browser.close()
            return;
        }

        const browser = launchResp.browser
        let page = launchResp.page

        page.on('dialog', async dialog => {
            console.log(dialog.message())
            let resp = await bradescoService.checkInfo(page, dialog)
            if (resp !== '') {
                clearInterval(tim2);
                resolve(resp)
                return;
            }
            return;
        })

        help.consoleLog('Realizando Login')
        let error = await bradescoService.login(page, req.body, browser)
        if (error) {
            clearInterval(tim2);

            // await help.respModify(error, page, 'Bradesco')
            browser.close()
            resolve(error)
            return;


        }

        page = await browser.pages()
        page = page[1]

        help.consoleLog('Inserindo dados do carro')
        let respAPI = await bradescoService.fillDataClient(page, req.body)
        if (respAPI) {
            clearInterval(tim2);

            // await help.respModify(respAPI, page, 'Bradesco')
            browser.close()
            resolve(respAPI)
            return;

        }

        respAPI = await bradescoService.fillDataCar(page, req.body)
        clearInterval(tim2);

        if (respAPI.header) {

            // await help.respModify(respAPI, page, 'Bradesco')
            browser.close()
            resolve(respAPI)
            return;

        }

        browser.close()

        help.consoleLog('Processo finalizado com sucesso.')

        respAPI = {
            header: {
                status: 1,
                message: "Valores processados com sucesso!",
                details: "Sucesso"
            },
            response: {
                entrada: respAPI.entrada,
                valorLiberado: respAPI.valorFinanciado,
                qtdParcela: respAPI.prazo,
                valorParcela: respAPI.parcela
            }
        }

        resolve(respAPI)
        return;
    })
}

async function validToken(token) {
    return new Promise(async (resolve, reject) => {
        if (token === tokenAuthorization) {
            resolve();
            return;
        } else {
            resolve(await help.messageError(401, 'Unauthorized', ''))
            return;
        }
    })
}


async function validReq(body) {
    return new Promise(async (resolve, reject) => {
        if (body.nome && body.nome !== "" && body.sobreNome && body.sobreNome !== "" && body.email && body.email !== "" && body.cargo && body.cargo !== "" && body.departamento && body.departamento !== "" && body.empresa && body.empresa !== "" && body.siteEmpresa && body.siteEmpresa !== "" && body.telefone && body.telefone !== "") {
            resolve();
            return;
        }
        resolve(await help.messageError('400', 'Solicitação incorreta'));
        return;
    })
}