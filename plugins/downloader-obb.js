import fetch from 'node-fetch';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!args[0]) throw 'Ex: ' + usedPrefix + command + ' minecraft';
    let res = await apk(text, conn);
    await m.reply('In progress, please wait...');
    conn.sendMessage(m.chat, { document: { url: res.download }, mimetype: res.mimetype, fileName: res.fileName }, { quoted: m });
};
handler.command = /^(obb)$/i;
handler.premium = true
handler.register = true
export default handler;

async function apk(url, conn) {
    let res = await fetch('http://ws75.aptoide.com/api/7/apps/search?query=' + encodeURIComponent(url) + '&limit=1');
    let $ = await res.json();
    let download = $.datalist.list[0].obb.main.path;
    let fileName = download.replace(/https:\/\/pool.obb.aptoide.com\//, ' ').match(/(\w*)\/(.*)/)[2].replace(/-/ig, '.');
    if (!download) throw 'Can\'t download the apk!';

    // Check file size before downloading
    let fileSize = parseInt((await fetch(download, { method: 'head' })).headers.get('content-length'));
    if (fileSize > 100 * 100 * 100) { // 80 MB
        throw 'File size exceeds the limit (100 MB).';
    }

    let icon = $.datalist.list[0].icon;
    let mimetype = (await fetch(download, { method: 'head' })).headers.get('content-type');
    return { fileName, mimetype, download };
}