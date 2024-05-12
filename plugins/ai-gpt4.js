import fetch from 'node-fetch';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!text) throw 'Ex: ' + usedPrefix + command + ' hello ai';
conn.sendPresenceUpdate('composing', m.chat);
    let res = await openai(text);
    let response = res.result;
    m.reply(response);
};

handler.command = /^(chatgpt4|gpt4)$/i;
handler.help = ["gpt4"];
handler.limit = 4
export default handler;

async function openai(text) {
    let response = await fetch(`https://aemt.me/gpt4?text=${text}`);
    let data = await response.json();
    let result = data.result;
    return { result };
}