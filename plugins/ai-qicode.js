import { toDataURL } from 'qrcode'
let handler = async (m, { text, conn }) => {
if (!text) throw `> *info ingrese el text que quiera convertitr en codigo qe*`
conn.sendFile(m.chat, await toDataURL(text.slice(0, 2048), { scale: 8 }), 'qrcode.png', '*dalich*', m)
}
handler.help = ['', 'code'].map(v => 'qr' + v + ' <teks>')
handler.tags = ['tools']
handler.command = /^qr(code)?$/i
export default handler
handler.limit = 2