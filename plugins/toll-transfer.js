const items = [
    'limit', 'exp', 'joincount', 'money', 'potion', 'trash', 'wood',
    'rock', 'string', 'petFood', 'emerald',
    'diamond', 'gold', 'iron', 'common',
    'uncoommon', 'mythic', 'legendary', 'pet',
];
let confirmation = {};

async function handler(m, { conn, args, usedPrefix, command }) {
    if (confirmation[m.sender]) return m.reply('estás haciendo una transferencia');
    let user = global.db.data.users[m.sender];
    const item = items.filter(v => v in user && typeof user[v] == 'number');

    let lol = `
╭━━━━━━━━━ ღ
┃ LIST
┃───────────
┃ limit *= Diamantes* 💎
┃ exp *= Experiencia* ⚡
╰━━━━━━━━━ ღ 

Ex : /transfer limit 5 2126XXXXXXXXX
`.trim();

    const type = (args[0] || '').toLowerCase();
    if (!item.includes(type)) return m.reply(lol);
    const count = Math.min(Number.MAX_SAFE_INTEGER, Math.max(1, (isNumber(args[1]) ? parseInt(args[1]) : 1))) * 1;
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : args[2] ? (args[2].replace(/[@ .+-]/g, '') + '@s.whatsapp.net') : '';
    if (!who) return m.reply(`${ag} *ETIQUETE AL USUARIO*`);
    if (!(who in global.db.data.users)) return m.reply(`${fg}*EL USUARIO ${who} NO SE ENCUENTRA EN MI BASE DE DATOS*`);
    if (user[type] * 1 < count) return m.reply(`${fg}*NO TIENE SUFUCIENTE PARA REALIZAR LA TRANSFERENCIA DE ${type}*`);
    let mentionedJid = [who];
    let username = conn.getName(who);

    let confirm = `
*ESTÁS A PUNTO DE HACER ESTA ACCIÓN DE TRANFERENCIA* 

💹 *${count} ${type} para* *@${(who || '').replace(/@s\.whatsapp\.net/g, '')}* ? 

*DESEAS CONTINUAR ?*
*Tienes 60 segundos!*

Escriba : (si) para confirmar
Escriba : (no) para cancelar\n\n${wm}`.trim();

    let c = `${wm}\n¡Tienes 60 segundos!`;
    await conn.reply(m.chat, confirm, m, { mentions: [who] });
    confirmation[m.sender] = {
        sender: m.sender,
        to: who,
        message: m,
        type,
        count,
        timeout: setTimeout(() => (m.reply('*SU TIEMPO SE HA TERMINADO*'), delete confirmation[m.sender]), 60 * 1000),
    };
}

handler.before = async m => {
    if (m.isBaileys) return;
    if (!(m.sender in confirmation)) return;
    if (!m.text) return;
    let { timeout, sender, message, to, type, count } = confirmation[m.sender];
    if (m.id === message.id) return;
    let user = global.db.data.users[sender];
    let _user = global.db.data.users[to];
    if (/^No|no$/i.test(m.text)) {
        clearTimeout(timeout);
        delete confirmation[sender];
        return m.reply('*CANCELADO*');
    }
    if (/^Si|si$/i.test(m.text)) {
        let previous = user[type] * 1;
        let _previous = _user[type] * 1;
        let amountBeforeDiscount = count; // المبلغ قبل الخصم
        let discountAmount = Math.ceil(count * 0.2); // خصم 20٪
        let amountAfterDiscount = count - discountAmount; // المبلغ بعد الخصم
        if (user[type] * 1 < amountBeforeDiscount) {
            return m.reply(`*${fg}*NO TIENES SUFICIENTE SALDO PARA REALIZAR LA TRANSFERENCIA ANTES DEL DESCUENTO.`);
        }
        user[type] -= amountBeforeDiscount;
        _user[type] += amountAfterDiscount;
        if (previous > user[type] * 1 && _previous < _user[type] * 1) {
            m.reply(`✅ *TRANSFERENCIA REALIZADA CON ÉXITO* :\n\n*${amountAfterDiscount} ${type} para* @${(to || '').replace(/@s\.whatsapp\.net/g, '')}`, null, { mentions: [to] });
        } else {
            user[type] = previous;
            _user[type] = _previous;
            m.reply(`*OCURRIÓ UN ERROR AL TRANSFERIR ${amountAfterDiscount} ${type} PARA* *@${(to || '').replace(/@s\.whatsapp\.net/g, '')}*`, null, { mentions: [to] });
        }
        clearTimeout(timeout);
        delete confirmation[sender];
    }
};

handler.help = ['transfer'].map(v => v + ' [tipo] [cantidad] [@tag]');
handler.tags = ['xp'];
handler.command = ['payxp', 'transfer', 'darxp', 'par', 'enviar', 'transferir'];
handler.register = true;
handler.disabled = false;

export default handler;

function special(type) {
    let b = type.toLowerCase();
    let special = (['common', 'uncoommon', 'mythic', 'legendary', 'pet'].includes(b) ? ' Crate' : '');
    return special;
}

function isNumber(x) {
    return !isNaN(x);
}
