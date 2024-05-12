import fetch from 'node-fetch';

import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg;

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!text) throw 'Ex: ' + usedPrefix + command + ' minecraft';
    try {
    await m.reply('*LOADING…*');
    
    
    let res = await apk(text);
    
    let appInfoMessage = `*Name :* ${res.name}\n*Downloads :* ${res.dc}\n*Package :* ${res.path}\n*File Size :* ${res.size}`;
    const interactiveMessage = {
        body: { text: appInfoMessage },
        footer: { text: "" },
        header: {
        hasMediaAttachment: true,...(await prepareWAMessageMedia({ image: { url: res.icon } }, { upload: conn.waUploadToServer }))
        },
        nativeFlowMessage: { 
            buttons: [{ 
                name: "quick_reply",
                buttonParamsJson: `{"display_text":"Download","id":".doapk ${res.name}"}`
            }]
        }
    };

    const message = { 
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 }, 
        interactiveMessage 
    };

    await conn.relayMessage(m.chat, { viewOnceMessage: { message } }, {});
    
    } catch (error) {
    await m.reply(`هناك ضغط على الموقع يرجى اعادة المحاولة لاحقا`);
    }
}

handler.command = /^(apk)$/i;
handler.help = ['apk'];
handler.tags = ['downloader'];
handler.premium = true
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
  if (getsize > 200000000) {
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