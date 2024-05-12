import yts from 'yt-search';
import fs from 'fs';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let fkontak = {
    "key": {
      "participants": "0@s.whatsapp.net",
      "remoteJid": "status@broadcast",
      "fromMe": false,
      "id": "Halo"
    },
    "message": {
      "contactMessage": {
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    "participant": "0@s.whatsapp.net"
  }

  if (!text) return conn.reply(m.chat, `Ex : /yts txt`, fkontak, m)

  try {
    let vids_ = {
      from: m.sender,
      urls: []
    }

    if (!global.videoList) {
      global.videoList = [];
    }

    if (global.videoList[0]?.from == m.sender) {
      delete global.videoList;
    }

    let results = await yts(text);

    let teks = results.all.map((v, i) => {
      let videoId = v.url.split('v=')[1];
      let link = `youtube.com/watch?v=${videoId}`;
      vids_.urls.push(link);
      return `[ ${i + 1} ]\n*Title :*\n${v.title}\n*Url :* ${link}\n*Views :* ${v.views}`
    }).join('\n\n\n\n');

    conn.sendFile(m.chat, results.all[0].thumbnail, 'yts.jpeg', teks, fkontak, m)
    global.videoList.push(vids_);
  } catch (error) {
    console.error(error);
  }
}

handler.help = ['', 'earch'].map(v => 'yts' + v + ' <pencarian>')
handler.tags = ['tools']
handler.command = /^playlist|ytbuscar|yts(earch)?$/i
handler.register = true
handler.limit = 5
handler.level = 0

export default handler