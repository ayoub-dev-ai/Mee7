let handler = async (m) => {
global.db.data.chats[m.chat].isBanned = true
m.reply(`𝙏𝙃𝙄𝙎 𝘾𝙃𝘼𝙏 𝙒𝘼𝙎 𝘽𝘼𝙉𝙉𝙀𝘿 👻`)
}
handler.help = ['banchat']
handler.tags = ['owner']
handler.command = /^banchat|bangata|banchat2$/i
export default handler