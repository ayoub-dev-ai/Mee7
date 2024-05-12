//new vs by angelo
import fetch from 'node-fetch'
import uploader from '../lib/uploadImage.js'

var handler = async (m, { conn, text, command, usedPrefix }) => {
    //fix var 
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (/image/g.test(mime) && !/webp/g.test(mime)) {
        let buffer = await q.download()

        conn.sendPresenceUpdate('composing', m.chat)
        //fix api new vs 1.5.5
        let media = await (uploader)(buffer)
        let json = await (await fetch(`https://aemt.me/bardimg?url=${media}&text=${text}`)).json()

        conn.sendMessage(m.chat, { text: json.result }, { quoted: m })

    } else {
        // Assuming fake should be a boolean value, set it to true or false
        const fake = true; // Change this according to your logic
        return conn.reply(m.chat, `*Ex : /bardimg (info)*`, m, fake);
    }
}
handler.help = ['bardimg']
handler.tags = ['ai']
handler.command = /^(bardimg|bardimage)$/i

handler.register = true;
handler.limit = 4;

export default handler
