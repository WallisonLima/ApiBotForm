const help = require("../helpers")
// const db = require('../database');
const tokenAuthorization = "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBUEkgRHJNb2JpbGUgR2F0ZUtlZXBlciIsInN1YiI6IjIiLCJpYXQiOjE2ODI3MTcxNTQsImV4cCI6MTY4MjgwMzU1NH0.5Bs2t0QyGo8mn5nDucgn_Z5-RtlVf1l8bfaq2oHBX6YDRMOBILE";
const botService = require('../services/botService')

class BotForm {
    async post(req, res) {

        // await db.insertDB('users', req.body)
        console.log('Iniciando')
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

        let { page, browser } = await botService.launch();
        if (!page) {
            res.send(await help.messageError(500, 'Browser default', ''))
            return;
        }

        page = await botService.insereDadosParceiro(page);

        page = await botService.insereDadosIndicado(page, dados);

        page = await botService.selecionaDadosIndicado(page, dados);

        page = await botService.clickBoxIndicado(page, dados);
        
        // await clickByAttr(page, "type", "submit")

        await browser.disconnect();

        console.log("Processo finalizado")
        await res.send(await help.messageError(200, 'Process concluded!', ''))
        return;


    }

}


module.exports = new BotForm();



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