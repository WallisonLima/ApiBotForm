
const puppeteer = require('puppeteer');
const url = "https://share.hsforms.com/1ZiclL5e7RjyOUoW0M4LsgQ12ig9";
const nomeParceiro = "Diego";
const empresaParceiro = "Dr Mobile";
const emailParceiro = "comercial@drmobile.com.br";


class BotFormService {
    async launch() {
        return new Promise(async (resolve, reject) => {
            try {
                const browser = await puppeteer.launch({ headless: false, dumpio: true })
                let page = await browser.pages()
                page = page[0]
                await page.goto(url)
                resolve({page, browser})
            } catch (e) {
                console.log("Erro " + e)
                resolve()
            }
        })
    }

    async insereDadosParceiro(page){
        return new Promise(async (resolve, reject) => {
            await sleep(1000);
            await clickByAttr(page, 'id', 'referral_nome-input');
            await page.keyboard.type(nomeParceiro);
    
            await sleep(1000);
            await clickByAttr(page, 'id', 'referral_empresa_parceira-input');
            await page.keyboard.type(empresaParceiro);
    
            await sleep(1000);
            await clickByAttr(page, 'id', 'referral_e_mail-input');
            await page.keyboard.type(emailParceiro);
    
            resolve(page)
        })
    }
    
    async insereDadosIndicado(page, dados){
        return new Promise(async (resolve, reject) => {
            await sleep(1000);
            await clickByAttr(page, 'id', 'firstname-input');
            await page.keyboard.type(dados.nome);
    
            await sleep(1000);
            await clickByAttr(page, 'id', 'lastname-input');
            await page.keyboard.type(dados.sobreNome);
    
            await sleep(1000);
            await clickByAttr(page, 'id', 'email-input');
            await page.keyboard.type(dados.email);
    
            await sleep(1000);
            await clickByAttr(page, 'id', 'company-input');
            await page.keyboard.type(dados.empresa);
    
            await sleep(1000);
            await clickByAttr(page, 'id', 'website-input');
            await page.keyboard.type(dados.siteEmpresa);
    
            resolve(page)
        })
    }
    
    async selecionaDadosIndicado(page, dados){
        return new Promise(async (resolve, reject) => {
            await sleep(1000);
            await page.select('#cargo-input', dados.cargo);
    
            await sleep(1000);
            await page.select('#departamento-input', dados.departamento);
    
            await sleep(1000);
            await page.select('#segmento-input', "Saúde");
    
            await sleep(1000);
            await page.select('#company_size-input', "250-999");
    
            await sleep(1000);
            await page.select('#dor-input', "Atendimento");
            
            await sleep(1000);
            await page.select('#volumetria-input', "Acima de 10.000 MAUs");
            
            await sleep(1000);
            await page.select('#maturidade-input', "1 - Entendia pouco da solução, mas foi educado sobre o assunto na qualificação");
            
            await sleep(1000);
            await page.select('#planos_blip-input', "Super");
    
            resolve(page)
        })
    }
    
    async clickBoxIndicado(page){
        return new Promise(async (resolve, reject) => {
            await sleep(1000);
            await clickByAttr(page, 'id', 'funcao_no_projeto-input-1');
    
            await sleep(1000);
            await clickByAttr(page, 'id', 'em_quais_canais_voce_tem_conta_comercial_-input-1');
    
            await sleep(1000);
            await clickByAttr(page, 'id', 'em_quais_canais_voce_tem_conta_comercial_-input-2');
    
            await sleep(1000);
            await clickByAttr(page, 'id', 'em_quais_canais_voce_tem_conta_comercial_-input-3');
            
            resolve(page)
        })
    }
}

module.exports = new BotFormService();






async function clickByAttr(page, attr, value, number = 0) {
    return new Promise(async (resolve, reject) => {
        let el = await page.$x("//*[@" + attr + "='" + value + "']")
        if (el.length > 0) {
            resolve(await el[number].click())
        } else {
            resolve(console.log('não encontrado ' + attr))
        }
    })
}



async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}