let handler = async (m, { conn, args, groupMetadata}) => {
    let who
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
    else who = m.chat
    if (!who) throw `Mention or tag someone`
    if (!(who in global.db.data.users)) throw `User not found in my database`
    let warn = global.db.data.users[who].warn
    if (warn > 0) {
        global.db.data.users[who].warn -= 1
        m.reply(`
        *WARNINGS*
        Warnings: *-1*
        Total warnings: *${warn - 1}*`)
        m.reply(`An admin reduced your warning, now you have *${warn - 1}*`, who)
    } else if (warn == 0) {
        m.reply('The user has no warnings')
    }
}

handler.help = ['unwarn @user']
handler.tags = ['group']
handler.command = ['delwarn'] 
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
