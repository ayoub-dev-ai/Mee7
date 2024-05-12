import ws from 'ws';

async function handler(m, { conn: _envio, usedPrefix }) {
const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];
function convertirMsADiasHorasMinutosSegundos(ms) {
var segundos = Math.floor(ms / 1000);
var minutos = Math.floor(segundos / 60);
var horas = Math.floor(minutos / 60);
var días = Math.floor(horas / 24);
segundos %= 60;
minutos %= 60;
horas %= 24;
var resultado = "";
if (días !== 0) {
resultado += días + " días, ";
}
if (horas !== 0) {
resultado += horas + " hours ";
}
if (minutos !== 0) {
resultado += minutos + " minutes ";
}
if (segundos !== 0) {
resultado += segundos + " Seconds ";
}
return resultado;
}

const message = users.map((v, index) => `(${index + 1})\n wa.me/${v.user.jid.replace(/[^0-9]/g, '')}?text=${usedPrefix}help\n*Name : ${v.user.name || '-'}*\n*time active :* ${ v.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - v.uptime) : "Desconocido"}`).join('\n\n\n\n');
  const replyMessage = message.length === 0 ? '*no hay sub bots disponible. verifique mas tarde.*' : message;
const totalUsers = users.length;
const responseMessage = `List of Subbots (Servbot/Jadibot) Activities\n\nYou can contact them to request to join a group, be respectful\n\nIf the text appears in blank, it means there are no active subbots\n\nEach subbot user handles functionality completely independently\n\nConnected Subbots : ${totalUsers || '0'}\n\n${replyMessage.trim()}`.trim();
await _envio.sendMessage(m.chat, {text: responseMessage, mentions: _envio.parseMention(responseMessage)}, {quoted: m})}

handler.command = ['listjadibots', 'bots', 'subsbots'];
handler.help = ['listjadibots'];
handler.tags = ['jadibot'];

export default handler;