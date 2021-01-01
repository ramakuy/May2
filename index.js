const qrcode = require("qrcode-terminal");
const menu = require("./menu.js");
const fs = require("fs");
const moment = require("moment");
const imageToBase64 = require("image-to-base64");
const axios = require("axios");
const
{
   WAConnection,
   MessageType,
   Presence,
   MessageOptions,
   Mimetype,
   WALocationMessage,
   WA_MESSAGE_STUB_TYPES,
   ReconnectMode,
   ProxyAgent,
   waChatKey,
} = require("@adiwajshing/baileys");
const { count } = require("console");
var jam = moment().format("HH:mm");

function foreach(arr, func)
{
   for (var i in arr)
   {
      func(i, arr[i]);
   }
}
const conn = new WAConnection()
conn.on('qr', qr =>
{
   qrcode.generate(qr,
   {
      small: true
   });
   console.log(`[ ${moment().format("HH:mm:ss")} ] Por favor escaneie o QR-Code com seu aplicativo!`);
});

conn.on('credentials-updated', () =>
{
   console.log(`credentials updated!`)
   const authInfo = conn.base64EncodedAuthInfo()
   fs.writeFileSync('./session.json', JSON.stringify(authInfo, null, '\t'))
})
fs.existsSync('./session.json') && conn.loadAuthInfo('./session.json')
conn.connect();

conn.on('user-presence-update', json => console.log(json.id + ' presence is ' + json.type))
conn.on('message-status-update', json =>
{
   const participant = json.participant ? ' (' + json.participant + ')' : '' // participant exists when the message is from a group
   console.log(`${json.to}${participant} acknlowledged message(s) ${json.ids} as ${json.type}`)
})

conn.on('message-new', async(m) =>
{
   const messageContent = m.message
   const text = m.message.conversation
   let id = m.key.remoteJid
   const messageType = Object.keys(messageContent)[0] // message will always contain one key signifying what kind of message
   let imageMessage = m.message.imageMessage;
   let videoMessage = m.message.videoMessage;
   console.log(`[ ${moment().format("HH:mm:ss")} ] (${id.split("@s.whatsapp.net")[0]} => ${text}`);

   if (text == '!menu'){
    conn.sendMessage(id, menu.menu ,MessageType.text);
    }

   if (messageType == 'imageMessage')
   {
      let caption = imageMessage.caption.toLocaleLowerCase()
      const buffer = await conn.downloadMediaMessage(m) // to decrypt & use as a buffer
      if (caption == '!sticker' || caption == "!stiker")
      {
        conn.sendMessage(id, '[Aguarde] ⌛ Carregando Sticker...', MessageType.text) // modificação top

         const stiker = await conn.downloadAndSaveMediaMessage(m) // to decrypt & save to file

         const
         {
            exec
         } = require("child_process");
         exec('cwebp -q 50 ' + stiker + ' -o temp/' + jam + '.webp', (error, stdout, stderr) =>
         {
            let stik = fs.readFileSync('temp/' + jam + '.webp')
            conn.sendMessage(id, stik, MessageType.sticker)
         });
      }
   }

   if (messageType == 'videoMessage'){
      let caption = videoMessage.caption.toLocaleLowerCase()
      const buffer = await conn.downloadMediaMessage(m)

      if (caption == "..gifsticker" || caption == "..stickergif"){
         conn.sendMessage(id, "[Aguarde] ⌛ Carregando Sticker...'", MessageType.text);
         
         const stiker = await conn.downloadAndSaveMediaMessage(m) // to decrypt & save to file

         const
         {
            exec
         } = require("child_process");
         exec('cwebp -q 50 ' + stiker + ' -o gif/' + jam + '.webp', (error, stdout, stderr) =>
         {
            setTimeout(function() {
               let stik = fs.readFileSync('gif/' + jam + '.webp')
               setTimeout(function() {
                  conn.sendMessage(id, stik, MessageType.sticker)
               }, 3000);
            }, 3000);
         });
      }
   }

if (text == '!playlist'){
conn.sendMessage(id, 'https://open.spotify.com/playlist/1xm2tB85vyIgEBWdGWSFOH?si=Vwkxfqc1TZKH_YRXaC8flg' ,MessageType.text);
}
if (text == 'Regrasmid'){
conn.sendMessage(id, '⚠ GRUPO DA MID ⚠ *SITE: www.oficialmidnight.com\r\n\r\nPROÍBIDO :\r\n\r\n• DIVULGAÇÃO DE OUTRO CONTEÚDO.\r\n\r\n• CONTEÚDO ADULTO (23:00 a 03:00 pode)\r\n\r\n• SPAMAR FIGURINHAS.\r\n\r\nMidnight 音楽' ,MessageType.text);
}
if (text == 'Regrasrx'){
conn.sendMessage(id, '⚠ REGRAS DO GRUPO ⚠\r\n\r\nValem para todos.(Inclusive ADMs)\r\n\r\nProibido SPAM, FLOOD incluindo emoji, correntes, gemidão.\r\n\r\nDIVULGAÇÃO DE LINKS SEM PERMISSÃO DE ADM, porém divulgação de outros grupos não serão aceitos em hipótese alguma, caso de permaban.\r\n\r\nTodos os membros devem se respeitar.\r\n\r\nProibido todo tipo de spoiler.\r\n\r\nCONTEÚDO SEXUAL (ISSO NÃO INCLUÍ conteúdo sujo).\r\n\r\nProibido qualquer conteúdo sexual antes das 00:00\r\n\r\nQualquer reclamação/pedido de link peçam NO GRUPO e marquem os adms.' ,MessageType.text);
}
if (text == '!séries'){
conn.sendMessage(id, '∆ SÉRIES ∆\r\n\r\nTodo Mundo Odeia O Chris https://redecanais.app/todo-mundo-odeia-o-chris-dublado-lista-completa-de-episodios-video_09d0a0ea6.html\r\n\r\niCarly: https://redecanais.app/icarly-dublado-legendado-lista-de-episodios_0669b38b1.html\r\n\r\nEu, a Patroa e as crianças: https://redecanais.app/eu-a-patroa-e-as-criancas-dublado-lista-de-episodios_166813daf.html\r\n\r\nSupernatural: https://redecanais.app/sobrenatural-supernatural-dublado-legendado-lista-de-episodios_fd59ced75.html\r\n\r\nThe walking dead: https://redecanais.app/the-walking-dead-dublado-legendado-lista-de-episodios_ff7cd1024.html\r\n\r\nUm maluco no pedaço: https://redecanais.app/um-maluco-no-pedaco-dublado-lista-de-episodios_1e2f527cc.html\r\n\r\nEmily em Paris: https://redecanais.app/emily-em-paris-dublado-lista-de-episodios_04e559bd5.html\r\n\r\nControl Z: https://redecanais.app/control-z-dublado-lista-de-episodios_d3b8c7676.html\r\n\r\nLazy town: https://redecanais.app/lazytown-dublado-lista-de-episodios_6e4f1f8d5.html\r\n\r\nEu nunca: https://redecanais.app/eu-nunca-dublado-lista-de-episodios_da859fb33.html\r\n\r\nThe end of the F***ing World: https://redecanais.app/the-end-of-the-fing-world-dublado-lista-de-episodios_5c8095d88.html\r\n\r\nRagnarok: https://redecanais.app/ragnarok-dublado-lista-de-episodios_ed5f94d95.html\r\n\r\nOuter banks: https://redecanais.app/outer-banks-dublado-lista-de-episodios_6196f245f.html\r\n\r\no pier: https://redecanais.app/o-pier-dublado-lista-de-episodios_82a4806de.html\r\n\r\nI am not okay with this: https://redecanais.app/i-am-not-okay-with-this-dublado-lista-de-episodios_f0cb860ea.html\r\n\r\nHawaii Five-0: https://redecanais.app/hawaii-five-0-dublado-lista-de-episodios_c0ac057d4.html\r\n\r\nLa casa de papel: https://redecanais.app/la-casa-de-papel-dublado-legendado-lista-de-episodios_58076d8a0.html\r\n\r\nGilmore Girls: https://redecanais.app/gilmore-girls-um-ano-para-recordar-dublado-lista-de-episodios_c10c8f61e.html\r\n\r\nThe witcher: https://redecanais.app/the-witcher-dublado-legendado-lista-de-episodios_8b05a1d21.html\r\n\r\nThe Act: https://redecanais.app/the-act-dublado-lista-de-episodios_f3cadd2cd.html\r\n\r\nOs feiticeiros de Waverly place: https://redecanais.app/os-feiticeiros-de-waverly-place-dublado-lista-de-episodios_97b0360fc.html\r\n\r\nHannah montana: https://redecanais.app/hannah-montana-dublado-lista-de-episodios_f80b6cff4.html\r\n\r\nCory na casa branca: https://redecanais.app/cory-na-casa-branca-dublado-lista-de-episodios_7ac0572dc.html\r\n\r\nL.A.s Finest: https://redecanais.app/las-finest-unidas-contra-o-crime-dublado-legendado-lista-de-episodios_62031cada.html\r\n\r\nVis a Vis: https://redecanais.app/vis-a-vis-dublado-lista-de-episodios_d7ce4a59c.html\r\n\r\nThe umbrella academy: https://redecanais.app/the-umbrella-academy-dublado-lista-de-episodios_e668d1dab.html\r\n\r\nThe society: https://redecanais.app/the-society-dublado-lista-de-episodios_549ef73ac.html\r\n\r\nThe rain: https://redecanais.app/the-rain-dublado-lista-de-episodios_bd6e51145.html\r\n\r\nPeaky blinders: https://redecanais.app/peaky-blinders-dublado-lista-de-episodios_a2f4256b7.html\r\n\r\nEuphoria: https://redecanais.app/euphoria-dublado-lista-de-episodios_4ecf5e1b2.html\r\n\r\nSex education: https://redecanais.app/sex-education-dublado-lista-de-episodios_d3fdc1a49.html\r\n\r\nSneaky Pete: https://redecanais.app/sneaky-pete-dublado-lista-de-episodios_f15dcbf83.html\r\n\r\nOn my block: https://redecanais.app/on-my-block-dublado-lista-de-episodio_554935d4b.html\r\n\r\nGood Girls: https://redecanais.app/good-girls-dublado-lista-de-episodios_1b3242bb0.html\r\n\r\nDark: https://redecanais.app/dark-dublado-lista-de-episodios_c87310430.html\r\n\r\nHow to Get Away With Murder: https://redecanais.app/how-to-get-away-with-murder-dublado-lista-de-episodios_d7f76772b.html\r\n\r\nYou: https://redecanais.app/voce-dublado-lista-de-episodios_6448ab004.html\r\n\r\nSiren: https://redecanais.app/siren-dublado-legendado-lista-de-episodios_9e9822347.html\r\n\r\nBlack mirror: https://redecanais.app/black-mirror-dublado-lista-de-episodios_f7b1136ff.html\r\n\r\nElite: https://redecanais.app/elite-dublado-lista-de-episodios_f4c68cf0a.html\r\n\r\nA maldição da residência de Hill: https://redecanais.app/a-maldicao-da-residencia-hill-dublado-lista-de-episodios_d0426d113.html' ,MessageType.text);
}
if (text == '!filmes'){
conn.sendMessage(id, '∆ FILMES ∆\r\n\r\nA saga Harry Potter: https://redecanais.app/harry-potter-e-a-pedra-filosofal-dublado-2001-1080p_04229ab19.html\r\n\r\nhttps://redecanais.app/harry-potter-e-a-camara-secreta-dublado-2002-1080p_fb1b907c3.html\r\n\r\nhttps://redecanais.app/harry-potter-e-o-prisioneiro-de-azkaban-dublado-2004-1080p_7d5d9fbcb.html\r\n\r\nhttps://redecanais.app/harry-potter-e-o-calice-de-fogo-dublado-2005-1080p_dd04a3c22.html\r\n\r\nhttps://redecanais.app/harry-potter-e-a-ordem-da-fenix-dublado-2007-1080p_9c0352e77.html\r\n\r\nhttps://redecanais.app/harry-potter-e-o-enigma-do-principe-dublado-2009-1080p_e5dbb9561.html\r\n\r\nhttps://redecanais.app/harry-potter-e-as-reliquias-da-morte-parte-1-dublado-2010-1080p-1_9978c55b2.html\r\n\r\nhttps://redecanais.app/harry-potter-e-as-reliquias-da-morte-parte-2-dublado-2011-1080p_760b61376.html\r\n\r\nO mistério do convento 2: https://redecanais.app/o-misterio-do-convento-2-cacadora-de-almas-dublado-2020-1080p_0c19ff77d.html\r\n\r\nBrinquedos do terror: https://redecanais.app/brinquedos-do-terror-dublado-2020-1080p_439f9de81.html\r\n\r\nA ligação: https://redecanais.app/a-ligacao-dublado-2020-1080p_154785841.html\r\n\r\nQuando você chegou: https://redecanais.app/quando-voce-chegou-dublado-2020-1080p_6bec30294.html\r\n\r\nProcurada: https://redecanais.app/procurada-dublado-2020-1080p_aa9bc831d.html\r\n\r\nArtemis fowl: https://redecanais.app/artemis-fowl-o-mundo-secreto-dublado-2020-1080p_72ad2be60.html\r\n\r\nArmas em jogo: https://redecanais.app/armas-em-jogo-dublado-2020-1080p_592e3b00d.html\r\n\r\nUrso sem curso o filme: https://redecanais.app/ursos-sem-curso-o-filme-dublado-2020-1080p_89a6087cb.html\r\n\r\nBob esponja o incrível resgate: https://redecanais.app/bob-esponja-o-incrivel-resgate-dublado-2020-1080p_649bb0f55.html\r\n\r\nAbc do amor: https://redecanais.app/abc-do-amor-dublado-2005-720p_d8883f6f4.html\r\n\r\nA Casa do terror: https://redecanais.app/a-casa-do-terror-dublado-2019-1080p_7dfddb221.html\r\n\r\nAbracadabra: https://redecanais.app/abracadabra-dublado-1993-1080p_5facf327b.html\r\n\r\nEnola Holmes: https://redecanais.app/enola-holmes-dublado-2020-1080p_ae171f5ca.html\r\n\r\nO diabo de cada dia: https://redecanais.app/o-diabo-de-cada-dia-dublado-2020-1080p_a007f61f1.html\r\n\r\nSegurança de shopping 1 e 2: https://redecanais.app/seguranca-de-shopping-dublado-2009-1080p_ecfe1b368.html\r\n\r\nhttps://redecanais.app/seguranca-de-shopping-2-dublado-2015-1080p_8bb6c895c.html\r\n\r\nMulan: https://redecanais.app/mulan-dublado-2020-1080p_c976e9099.html\r\n\r\nEra uma vez um Deadpool: https://redecanais.app/era-uma-vez-um-deadpool-legendado-2018-1080p_ef75cc897.html\r\n\r\nFuga de Auschwitz: https://redecanais.app/fuga-de-auschwitz-dublado-2020-1080p_ec68b17a5.html\r\n\r\noração diabólica: https://redecanais.app/oracao-diabolica-dublado-2020-1080p_538434cb4.html' ,MessageType.text);
}
	
if (text == '!sticker'){
conn.sendMessage(id, 'É NA LEGENDA DA FOTO SEU PRIMATA BURRO' ,MessageType.text);
}		 
if (text == '/sticker'){
conn.sendMessage(id, 'É COM ! KRL' ,MessageType.text);
}	
	
   if (text.includes("!cat"))
   {
      var itens = ["cat", "gatos", "cat cutie", "gato"];
      var girl = itens[Math.floor(Math.random() * itens.length)];
      var url = "https://api.fdci.se/rep.php?gambar=" + girl;

      axios.get(url)
         .then((result) => {
            var b = JSON.parse(JSON.stringify(result.data));
            var girls = b[Math.floor(Math.random() * b.length)];
            imageToBase64(girls)
            .then(
               (response) => {
            var buf = Buffer.from(response, 'base64');
                  conn.sendMessage(
                     id, buf, MessageType.image)
               }
            )
            .catch(
               (error) => {
                  console.log(error);
               }
            )
         });

   }

   if (text.includes("!dog"))
   {
      var itens = ["cachorro", "cachorros", "dog", "dog cutie"];
      var boy = itens[Math.floor(Math.random() * itens.length)];
      var url = "https://api.fdci.se/rep.php?gambar=" + boy;

      axios.get(url)
         .then((result) => {
            var b = JSON.parse(JSON.stringify(result.data));
            var boys = b[Math.floor(Math.random() * b.length)];
            imageToBase64(boys)
            .then(
               (response) => {
            var buf = Buffer.from(response, 'base64');
                  conn.sendMessage(
                     id, buf, MessageType.image)
               }
            )
            .catch(
               (error) => {
                  console.log(error);
               }
            )
         });

   }

   if (text.includes("!image"))
   {
      var texto = text.replace("!searchimage ", "");
      var url = "https://api.fdci.se/rep.php?gambar=" + texto;

      axios.get(url)
         .then((result) => {
            var b = JSON.parse(JSON.stringify(result.data));
            var imagem = b[1];
            imageToBase64(imagem)
            .then(
               (response) => {
            var buf = Buffer.from(response, 'base64');
                  conn.sendMessage(
                     id, buf, MessageType.image)
               }
            )
            .catch(
               (error) => {
                  console.log(error);
               }
            )
         });

   }

   if (text.includes('!trap')){
  var teks = text.replace(/!trap /, '')
    axios.get(`https://tobz-api.herokuapp.com/api/nsfwtrap`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
   
   if (text.includes("!link")){
const teks = text.replace(/!link/, "")
axios.get(`https://mnazria.herokuapp.com/api/porn?search=${teks}`).then((res) => {
    let porno = ` *LISTA DOS RESULTADOS* \n\n *Canal:* ${res.data.result[0].actors} \n\n *DURAÇÃO:* ${res.data.result[0].duration}  \n\n *TITULO:* ${res.data.result[0].title}\n\n *URL:* ${res.data.result[0].url}`;
    conn.sendMessage(id, porno ,MessageType.text);
})
}
	
if (text.includes('!hentai')){
  var teks = text.replace(/!randomhentai2 /, '')
    axios.get(`https://tobz-api.herokuapp.com/api/hentai`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}
 
   if (text.includes("May")){
const aris = text.replace(/May /, "")
axios.get(`https://tobz-api.herokuapp.com/api/simsimi?text=${aris}`).then((res) => {
    let hasil = `${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
  })
 }
 if (text.includes("may")){
const aris = text.replace(/may /, "")
axios.get(`https://tobz-api.herokuapp.com/api/simsimi?text=${aris}`).then((res) => {
    let hasil = `${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
  })
 }
 if (text.includes("bota")){
const aris = text.replace(/bot /, "")
axios.get(`https://tobz-api.herokuapp.com/api/simsimi?text=${aris}`).then((res) => {
    let hasil = `${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
  })
 }
 if (text.includes("Bot")){
const aris = text.replace(/Bot /, "")
axios.get(`https://tobz-api.herokuapp.com/api/simsimi?text=${aris}`).then((res) => {
    let hasil = `${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
  })
 }
   
   if (text.includes("!letra")){
	const teks = text.split("#letra")[1]
	axios.get(`http://scrap.terhambar.com/lirik?word=${teks}`).then ((res) => {
	 	let hasil = `Letra: ${teks}\n\n\n ${res.data.result.lirik}`
	conn.sendMessage(id, hasil, MessageType.text)
	})
}
  	
	
if (text.includes("!ip"))
  { const aris = text.replace(/!ip /, "") 
  axios.get(`https://mnazria.herokuapp.com/api/check?ip=${aris}`).then((res) =>{ 
  let hasil = ` *🔍CONSULTA REALIZADA🔍* \n\n ➸ *CIDADE:*  ${res.data.city}\n ➸ *Latitude* : ${res.data.latitude}\n ➸ *Longtitude* : ${res.data.longitude}\n ➸ *REGIÃO* : ${res.data.region_name}\n ➸ *UF* : ${res.data.region_code}\n ➸ *IP* : ${res.data.ip}\n ➸ *TIPO* : ${res.data.type}\n ➸ *CEP* : ${res.data.zip}\n ➸ *LOCALIDADE* : ${res.data.location.geoname_id}\n ➸ *CAPITAL* : ${res.data.location.capital}\n ➸ *DDD* : ${res.data.location.calling_code}\n ➸ *PAÍS* : ${res.data.location.country_flag_emoji}\n *📌BY:May Bot*` 
  conn.sendMessage(id, hasil, MessageType.text); 
 })
 }
	
if (text.includes('!cry')){
  var teks = text.replace(/!randomcry /, '')
    axios.get(`https://tobz-api.herokuapp.com/api/cry`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}	

if (text.includes("!cnpj")){
const aris = text.replace(/!cnpj /, "")
axios.get(`https://www.receitaws.com.br/v1/cnpj/${aris}`).then((res) => {
	conn.sendMessage(id, '[❗] ESPERE ESTOU BUSCANDO DADOS', MessageType.text)
         let cep = `*🔍CONSULTA REALIZADA🔍* \n\n ➸ *ATIVIDADE PRINCIPAL:* ${res.data.atividade_principal[0].text} \n\n ➸ *DATA SITUAÇÃO:* ${res.data.data_situacao}\n\n ➸ *TIPO:* ${res.data.tipo} \n\n ➸ *NOME:* ${res.data.nome} \n\n ➸ *UF:* ${res.data.uf} \n\n ➸ *TELEFONE:* ${res.data.telefone}\n\n ➸ *SITUAÇÃO:* ${res.data.situacao} \n\n ➸ *BAIRRO:* ${res.data.bairro} \n\n ➸ *RUA:* ${res.data.logradouro} \n\n ➸ *NÚMERO :* ${res.data.numero} \n\n ➸ *CEP :* ${res.data.cep} \n\n ➸ *MUNICÍPIO:* ${res.data.municipio} \n\n ➸ *PORTE:* ${res.data.porte}\n\n ➸ *ABERTURA:* ${res.data.abertura}\n\n ➸ *NATUREZA JURÍDICA:* ${res.data.natureza_juridica} \n\n ➸ *FANTASIA:* ${res.data.fantasia}\n\n ➸ *CNPJ:* ${res.data.cnpj}\n\n ➸ *ÚLTIMA ATUALIZAÇÃO:* ${res.data.ultima_atualizacao}\n\n ➸ *STATUS:* ${res.data.status}\n\n ➸ *COMPLEMENTO:* ${res.data.complemento}\n\n ➸ *EMAIL:* ${res.data.email}\n\n *📌BY:May Bot* `;
    conn.sendMessage(id, cep ,MessageType.text);
}) 
}
if (text.includes("!cpf")){
const aris = text.replace(/!cpf /, "")
axios.get(`https://hastebin.com/raw/edihopuvug.json${aris}`).then((res) => {
	conn.sendMessage(id, '[❗] ESPERE ESTOU BUSCANDO DADOS', MessageType.text)
         let ecpf = `*🔍CONSULTA REALIZADA🔍* \n\n ➸ *CPF:* ${res.data.CPF} \n\n ➸ *NOME:* ${res.data.Nome}\n\n ➸ *MÃE:* ${res.data.NomeMae} \n\n ➸ *NASCIMENTO:* ${res.data.DataNascimento} \n\n ➸ *RUA:* ${res.data.Rua} \n\n ➸ *N°:* ${res.data.NumeroRua}\n\n ➸ *COMPLEMENTO:* ${res.data.Complemento}\n\n ➸ *BAIRRO:* ${res.data.Bairro}\n\n ➸ *CEP:* ${res.data.CEP}\n\n ➸ *UF:* ${res.data.EstadoSigla}\n\n ➸ *CIDADE:* ${res.data.Cidade}\n\n ➸ *ESTADO:* ${res.data.Estado}\n\n ➸ *PAIS:* ${res.data.Pais}  \n\n *📌BY:May Bot* `;
    conn.sendMessage(id, ecpf ,MessageType.text);
}) 
}

if (text.includes("!geradorcpf")){
const aris = text.replace(/!geradorcpf/, "")
axios.get(`http://geradorapp.com/api/v1/cpf/generate?token=40849779ec68f8351995def08ff1e2fa`).then((res) => {
	conn.sendMessage(id, '[❗] ESPERE ESTA PROCESSANDO', MessageType.text)
         let cpf = `*🔍CPF GERADOS🔍* \n\n ➸ *CPF:* ${res.data.data.number}  \n\n *📌BY:May Bot*`;
    conn.sendMessage(id, cpf ,MessageType.text);
})
}	

if (text.includes("!cep")){
const aris = text.replace(/!cep /, "")
axios.get(`https://viacep.com.br/ws/${aris}/json/`).then((res) => {
	conn.sendMessage(id, '[❗] ESPERE ESTOU BUSCANDO DADOS', MessageType.text)
         let cep = `*🔍CONSULTA REALIZADA🔍* \n\n ➸ *CEP:* ${res.data.cep} \n\n ➸ *ENDEREÇO:* ${res.data.logradouro}\n\n ➸ *COMPLEMENTO:* ${res.data.complemento} \n\n ➸ *BAIRRO:* ${res.data.bairro} \n\n ➸ *LOCALIDADE:* ${res.data.localidade} \n\n ➸ *UF:* ${res.data.uf}\n\n ➸ *DDD:* ${res.data.ddd} \n\n *📌BY:May Bot* `;
    conn.sendMessage(id, cep ,MessageType.text);
}) 
}


if (text.includes("!placa"))
  { const aris = text.replace(/!placa /, "") 
  axios.get(`https://apicarros.com/v1/consulta/${aris}/json`).then((res) =>{ 
  let hasil = ` *🔍CONSULTA REALIZADA🔍* \n\n ➸ *ANO:*  ${res.data.ano}\n ➸ *ANO MODELO* : ${res.data.anoModelo}\n ➸ *CHASSI* : ${res.data.chassi}\n ➸ *CODIGO RETORNO* : ${res.data.codigoRetorno}\n ➸ *CODIGO SITUACAO* : ${res.data.codigoSituacao}\n ➸ *COR* : ${res.data.cor}\n ➸ *MARCA* : ${res.data.marca}\n ➸ *MUNICIPIO* : ${res.data.municipio}\n ➸ *SITUACAO* : ${res.data.situacao}\n ➸ *UF* : ${res.data.uf}\n *📌BY:May Bot*` 
  conn.sendMessage(id, hasil, MessageType.text); 
 })
 }		
	
	 //Novato
if (text.includes("Bem-vindo"))
   {
    var items = ["anime loli"];
    var nime = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + nime;
    
    axios.get(url)
      .then((result) => {
        var n = JSON.parse(JSON.stringify(result.data));
        var nimek =  n[Math.floor(Math.random() * n.length)];
        imageToBase64(nimek) 
        .then(
            (response) => {
    conn.sendMessage(id, 'Tem membro novo ???', MessageType.text, { quoted: m } )
	var buf = Buffer.from(response, 'base64'); 
              conn.sendMessage(id, buf ,MessageType.image, { caption: `Seja bem-vindo seu filhote de tamanduá`, quoted: m } )
            }
        )
        .catch(
            (error) => {
                console.log(error);
            }
        )
    });
    }	

//Adm
if (text.includes("https://youtu.be/"))
   {
    var items = ["monkey"];
    var nime = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + nime;
    
    axios.get(url)
      .then((result) => {
        var n = JSON.parse(JSON.stringify(result.data));
        var nimek =  n[Math.floor(Math.random() * n.length)];
        imageToBase64(nimek) 
        .then(
            (response) => {
    conn.sendMessage(id, '[ ATENÇÃO ] ALERTA DE LINK', MessageType.text, { quoted: m } )
	var buf = Buffer.from(response, 'base64'); 
              conn.sendMessage(id, buf ,MessageType.image, { caption: `Cadê o macaco do adm??`, quoted: m } )
            }
        )
        .catch(
            (error) => {
                console.log(error);
            }
        )
    });
    }	

		  //Neko
if (text.includes("!neko"))
   {
    var items = ["anime neko"];
    var nime = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + nime;
    
    axios.get(url)
      .then((result) => {
        var n = JSON.parse(JSON.stringify(result.data));
        var nimek =  n[Math.floor(Math.random() * n.length)];
        imageToBase64(nimek) 
        .then(
            (response) => {
    conn.sendMessage(id, '[ ATENÇÃO ] Em andamento⏳ por favor, aguarde um momento', MessageType.text, { quoted: m } )
	var buf = Buffer.from(response, 'base64'); 
              conn.sendMessage(id, buf ,MessageType.image, { caption: `S-sen pai gostou?👉👈`, quoted: m } )
            }
        )
        .catch(
            (error) => {
                console.log(error);
            }
        )
    });
    }
	
	  //Random wallpaper
if (text.includes('!wallpaper')){
conn.sendMessage(id, 'Calma ae macaco',MessageType.text, { quoted: m } );
}
if (text.includes("!wallpaper"))
   {
    var items = ["wallpaper aesthetic", "wallpaper tumblr", "wallpaper space"];
    var nime = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + nime;
    
    axios.get(url)
      .then((result) => {
        var n = JSON.parse(JSON.stringify(result.data));
        var nimek =  n[Math.floor(Math.random() * n.length)];
        imageToBase64(nimek) 
        .then(
            (response) => {
    conn.sendMessage(id, '[ ATENÇÃO ] Procurando wallpaper⏳ Por favor, espere', MessageType.text, { quoted: m } )
	var buf = Buffer.from(response, 'base64'); 
              conn.sendMessage(id, buf, MessageType.image, { quoted : m } )
            }
        )
        .catch(
            (error) => {
                console.log(error);
            }
        )
    });
    }
	
if (text.includes("!yt")){
const teks = text.replace(/!ytmp4 /, "")
axios.get(`https://alfians-api.herokuapp.com/api/ytv?url=${teks}`).then((res) => {
	conn.sendMessage(id, '[ESPERA] Procurando...⏳', MessageType.text)
    let hasil = ` *Título:* ${res.data.title}\n\n *Tipo:* ${res.data.ext}\n\n *Resolução:* ${res.data.resolution}\n\n *Tamanho:* ${res.data.filesize}\n\n *Audio:* ${res.data.result}`;
    conn.sendMessage(id, hasil ,MessageType.text);
})
}	

if (text.includes("!twt"))
   {
    var items = ["twitter maicon küster", "twitter felipe neto", "twitter crimes reais"];
    var nime = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + nime;
    
    axios.get(url)
      .then((result) => {
        var n = JSON.parse(JSON.stringify(result.data));
        var nimek =  n[Math.floor(Math.random() * n.length)];
        imageToBase64(nimek) 
        .then(
            (response) => {
    conn.sendMessage(id, '[⏳] Estou esperando os Deuses postarem algo', MessageType.text, { quoted: m } )
	var buf = Buffer.from(response, 'base64'); 
              conn.sendMessage(id, buf, MessageType.image, { quoted: m } )
            }
        )
        .catch(
            (error) => {
                console.log(error);
            }
        )
    
    });
    }
	
   if (text.includes("!test id")){
      conn.sendMessage(id, id, MessageType.text);
      conn.sendMessage(id, MessageType + " / " + messageType, MessageType.text);
   }

 if (text.includes('!pornhub')){
var porn = text.split("!pornhub ")[1];
    var text1 = porn.split("|")[0];
    var text2 = porn.split("|")[1];
    axios.get(`https://mhankbarbars.herokuapp.com/api/textpro?theme=pornhub&text1=${text1}&text2=${text2}`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, '[ ⏳ ] Calma ae filhote de tamanduá', MessageType.text, { quoted: m })
            conn.sendMessage(id, buf, MessageType.image, { quoted: m });
        })
    })
}

	  //Random memme
if (text.includes('!meme')){
conn.sendMessage(id, 'Calma ae monkey',MessageType.text, { quoted: m } );
}
if (text.includes("!meme"))
   {
    var items = ["memes brasil","meme brasil","meme bolsonaro"];
    var nime = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + nime;
    
    axios.get(url)
      .then((result) => {
        var n = JSON.parse(JSON.stringify(result.data));
        var nimek =  n[Math.floor(Math.random() * n.length)];
        imageToBase64(nimek) 
        .then(
            (response) => {
    conn.sendMessage(id, '[ ATENÇÃO ] Hoje eu tô comediante', MessageType.text, { quoted: m } )
	var buf = Buffer.from(response, 'base64'); 
              conn.sendMessage(id, buf, MessageType.image, { quoted: m } )
            }
        )
        .catch(
            (error) => {
                console.log(error);
            }
        )
    });
    }

 //Loli
if (text.includes("!loli"))
   {
    var items = ["anime loli"];
    var nime = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + nime;
    
    axios.get(url)
      .then((result) => {
        var n = JSON.parse(JSON.stringify(result.data));
        var nimek =  n[Math.floor(Math.random() * n.length)];
        imageToBase64(nimek) 
        .then(
            (response) => {
    conn.sendMessage(id, '[ ATENÇÃO ] Em andamento⏳ por favor seu lolicon, aguarde', MessageType.text, { quoted: m } )
	var buf = Buffer.from(response, 'base64'); 
              conn.sendMessage(id, buf ,MessageType.image, { caption: `POLÍCIAAAA`, quoted: m } )
            }
        )
        .catch(
            (error) => {
                console.log(error);
            }
        )
    });
    }	

//Anime
if (text.includes("!anime"))
   {
    var items = ["anime girl", "anime", "anime neko"];
    var nime = items[Math.floor(Math.random() * items.length)];
    var url = "https://api.fdci.se/rep.php?gambar=" + nime;
    
    axios.get(url)
      .then((result) => {
        var n = JSON.parse(JSON.stringify(result.data));
        var nimek =  n[Math.floor(Math.random() * n.length)];
        imageToBase64(nimek) 
        .then(
            (response) => {
    conn.sendMessage(id, 'A não.... Lá vem o otaku', MessageType.text, { quoted: m } )
	var buf = Buffer.from(response, 'base64'); 
              conn.sendMessage(id, buf ,MessageType.image, { caption: `Vai tomar banho seu fedido`, quoted: m } )
            }
        )
        .catch(
            (error) => {
                console.log(error);
            }
        )
    });
    }	
	
   if (text.includes("!promover")){
      let texto = text.replace("!promover ", "");
      await conn.groupMakeAdmin(id, ["@s.whatsapp.net"])
   }

   if (text.includes("!rebaixar")){
      let texto = text.replace("!rebaixar ", "");
      await conn.groupDemoteAdmin(id, ["@s.whatsapp.net"])
   }

   if (text.includes("!kick")){
      let texto = text.replace("!kick ", "");
      await conn.groupRemove(id, ["@s.whatsapp.net"])
   }
	
if (text.includes('!all')){
var value = text.replace(text.split(' ')[0], '')
var group = await conn.groupMetadata(id)
var member = group['participants']
var ids = []
member.map( async adm => {
    ids.push(adm.id.replace('c.us', 's.whatsapp.net'))
})
var options = {
    text: value,
    contextInfo: { mentionedJid: ids },
    quoted: m
}
   if (text.includes("!escrever")){
      var texto = text.replace("!escrever ", "");
      conn.sendMessage(id, texto, MessageType.text);
   }

if (text.includes('!blackpink')){
  var teks = text.replace(/!blackpink /, '')
    axios.get(`https://docs-jojo.herokuapp.com/api/blackpink?text=${teks}`).then((res) => {
      imageToBase64(res.data.result)
        .then(
          (ress) => {
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}	
	
 if (text.includes('!waifu')){
  var teks = text.replace(/.waifu /, '')
    axios.get('https://st4rz.herokuapp.com/api/waifu')
    .then((res) => {
      imageToBase64(res.data.image)
        .then(
          (ress) => {
            conn.sendMessage(id, '[❗] TÔ PROCURANDO', MessageType.text)
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.image)
        })
    })
}	
	
if (text.includes('!tts')){
  var teks = text.replace(/!tts /, '')
    axios.get('http://scrap.terhambar.com/tts?kata=${teks}')
    .then((res) => {
      audioToBase64(res.data.result)
        .then(
          (ress) => {
            conn.sendMessage(id, '[Aguarde] ⌛ Carregando Audio...', MessageType.text)
            var buf = Buffer.from(ress, 'base64')
            conn.sendMessage(id, buf, MessageType.audio)
        })
    })
}    
	    
/*if (text.includes("!tts")) {
      const fs = require("fs");
      const spawn = require("child_process").spawn;
      conn.sendMessage(id, "[Aguarde] ⌛ Carregando Audio...", MessageType.text)
      // code to run the code skeak.py in python
      const process = spawn("python", ["./speech.py", text]);
      process.stdout.on('data', data => {
         console.log(data.toString());
      });
      if (text.length > 200){
         conn.sendMessage(id, "Mensagem muito longa", MessageType.text);
      }else{
      // function to send message audio with delay
      setTimeout(function(){
      const buffer = fs.readFileSync("./mp3/som.mp3", {encoding: 'utf-8', flag: 'r'});
      setTimeout(function(){
      conn.sendMessage(id, buffer, MessageType.audio)}, 4000);
      // function to delete audio message inside the mp3 folder
      setTimeout(function(){
      const process2 = spawn("python", ["./delete.py"]);
      process2.stdout.on('data', data => {
         console.log(data.toString());
      });}, 
      12000);
      }, 5000);
   }
   }*/
      })
