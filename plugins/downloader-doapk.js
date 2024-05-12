import fetch from 'node-fetch';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!text) throw 'Ex: ' + usedPrefix + command + ' minecraft';
    try {
    await m.reply('_In progress, please wait..._');

    let res = await apk(text);
    
    const fileName = `${res.path}.${res.format}`;
    await conn.sendMessage(
    m.chat,
    { document: { url: res.dl }, mimetype: res.mimetype, fileName: fileName },
    { quoted: m }
  );
    } catch (error) {
    await m.reply(`هناك ضغط على الموقع يرجى اعادة المحاولة لاحقا`);
    }
}

handler.command = /^(doapk)$/i;
handler.premium = true;
export default handler;

async function apk(text) {
  let response = await fetch(`https://satisfying-spice-hamster.glitch.me/search?q=${text}`);
  let $ = await response.json();
  let name = $.appName;
  let icon = $.image;
  let dl = $.Downloadlink;
  let format = $.appFormat;
  if(!dl) throw 'Can\'t download the apk!';
  let dc = $.downloadCount;
  let path = $.packageName;
  let mimetype = (await fetch(dl, { method: 'head' })).headers.get('content-type');
  const getsize = (await fetch(dl, { method: 'head' })).headers.get('Content-Length');
  if (getsize > 500000000) {
  throw 'حجم ملف apk كبير جدًا. الحد الأقصى لحجم التنزيل هو 500 ميغابايت.';
  }
  let size = formatBytes(parseInt(getsize));
  return { name, icon, dl, dc, path, format, size, mimetype}
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}