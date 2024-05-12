let handler = async(m, { conn, text, usedPrefix, command }) => {
try {
const json = await pinterest(text)
conn.sendButton(m.chat, ``, ``, json.getRandom(), [
['🔄 𝙎𝙞𝙜𝙪𝙞𝙚𝙣𝙩𝙚 | 𝙉𝙚𝙭𝙩', `/apk ${text}`]], null, null, m)
} catch (e) {
}}
handler.command = /^(test1)$/i
export default handler;