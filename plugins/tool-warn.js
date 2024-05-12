let handler = async (m, { conn, text, args, groupMetadata, usedPrefix, command }) => {
    const war = global.maxwarn; // Define war within the handler function

    const mssg = {
        noMention: "Please mention a user.\n\nEx : " + usedPrefix + command + " @user",
        userDb: "User not found in the database.",
        userWarn: "*USER HAS BEEN WAENED*",
        warn: "Warning",
        warnRec: "You've been warned.",
        warnMaxU: (war) => `⛔ You've reached the maximum number of warnings (${war}).`,
        wningUser: (war) => `User will be removed after ${war} warnings.`
    };

    let who;
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    else who = m.chat;
    if (!who) throw mssg.noMention;
    if (conn.user.jid.includes(who)) return m.reply(`✳️ Mention a user who is not a bot`);
    if (!(who in global.db.data.users)) throw mssg.userDb;
    let txt = text.replace('@' + who.split`@`[0], '').trim();
    let name = conn.getName(m.sender);
    let warn = global.db.data.users[who].warn;
    if (warn < war) {
        global.db.data.users[who].warn += 1;
        m.reply(`${mssg.userWarn}
▢ *Admin :* ${name}
▢ *User :* @${who.split`@`[0]}
▢ *Warns :* ${warn + 1}/${war}
▢ *With :* ${txt}`, null, { mentions: [who] });
        m.reply(`
⚠️ ${mssg.warn.toUpperCase()} ⚠️
${mssg.warnRec}

▢ *Warns :* ${warn + 1}/${war} 
${mssg.wningUser(war)}`, who);
    } else if (warn == war) {
        global.db.data.users[who].warn = 0;
        m.reply(`${mssg.warnMaxU(war)}`);
        await time(3000);
        await conn.groupParticipantsUpdate(m.chat, [who], 'remove');
        m.reply(`♻️ You have been removed from the group *${groupMetadata.subject}* because you have been warned *${war}* times`, who);
    }
}

handler.help = ['warn @user'];
handler.tags = ['group'];
handler.command = ['warn'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;

const time = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

