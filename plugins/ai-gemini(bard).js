import fetch from 'node-fetch';

var handler = async (m, { text, usedPrefix, command }) => {

    if (!text) return conn.reply(m.chat, `🎌 *Ingresé una petición*\n\nEx, /bard Conoces mee6?`, m);

    try {
        conn.sendPresenceUpdate('composing', m.chat);
        var apii = await fetch(`https://aemt.me/bard?text=${text}`);
        var res = await apii.json();
        await m.reply(res.result);
    } catch (error) {
        console.error(error);
        return conn.reply(m.chat, `*🚩 Ocurrió un fallo*`, m);
    }

};

handler.command = ['bard22'];
handler.help = ['bard'];
handler.tags = ['ai'];
handler.premium = false;

export default handler;
