import { canLevelUp, xpRange } from '../lib/levelling.js'
import { levelup } from '../lib/canvas.js'
import can from 'knights-canvas'

let handler = async (m, { conn }) => {

function test(num, size) {
var s = num+''
while (s.length < size) s = '0' + s
return s
}

let user = global.db.data.users[m.sender]
let name = conn.getName(m.sender)
let whoPP = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let ppBot = await conn.profilePictureUrl(whoPP, 'image').catch((_) => 'https://telegra.ph/file/24fa902ead26340f3df2c.png')

let image = await new can.Rank().setAvatar(ppBot).setUsername(name ? name.replaceAll('\n','') : '-').setBg('https://telegra.ph/file/fde739f66f1b81a43fe54.jpg').setNeedxp(wm).setCurrxp(`${user.exp}`).setLevel(`${user.level}`).setRank('https://i.ibb.co/Wn9cvnv/FABLED.png').toAttachment()
let data = image.toBuffer()

let { role } = global.db.data.users[m.sender]
if (!canLevelUp(user.level, user.exp, global.multiplier)) {
let { min, xp, max } = xpRange(user.level, global.multiplier)

let le = `*Name* ${name}

Level : *${user.level}* 📊
XP : *${user.exp - min} / ${xp}*

Not enough XP *${max - user.exp}* Again! ✨`
await conn.sendMessage(m.chat, { image: data, caption: le }, { quoted: m })
}
let before = user.level * 1
while (canLevelUp(user.level, user.exp, global.multiplier)) user.level++
if (before !== user.level) {

let str = `*🥳 New level 🥳* 
*• 🧬 Previous level :* ${before}
*• 🧬 New levels :* ${user.level}
*• 📅 Date :* ${new Date().toLocaleString('id-ID')}

*Note:* _Chont more often interact with the bot, the greater your level_`
try {
await conn.sendMessage(m.chat, { image: data, caption: str }, { quoted: m })
} catch (e) {
m.reply(str)
}}

}
handler.help = ['levelup']
handler.tags = ['rg']
handler.command = ['levelup']
handler.limit = 4
handler.exp = 50
handler.register = true
export default handler;
