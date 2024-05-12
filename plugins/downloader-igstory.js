let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `*${usedPrefix + command} dalich._.98*`
    try {
        conn.reply(m.chat, `_*Please wait*_`, m, { contextInfo: { externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: 'story | beta', body: 'From mee7 ai', previewType: 0, thumbnail: gataMenu, sourceUrl: md}}})
        const res = await fetch(`https://api.lolhuman.xyz/api/igstory/${args[0]}?apikey=${lolkeysapi}`)
        var anu = await res.json()
        var anuku = anu.result
        if (anuku == '') return m.reply(`${lenguajeGB['smsAvisoFG']()}${mid.smsInsta3}`)
        for (var i of anuku) {
            let res = await axios.head(i)
            let mime = res.headers['content-type'] 
            if (/image/.test(mime)) await conn.sendFile(m.chat, i, 'error.jpg', null, m).catch(() => { return m.reply(`${lenguajeGB['smsAvisoFG']()}${mid.smsInsta3}`)})
            if (/video/.test(mime)) await conn.sendFile(m.chat, i, 'error.mp4', null, m).catch(() => { return m.reply(`${lenguajeGB['smsAvisoFG']()}${mid.smsInsta3}`)})
        }
    } catch (e) {
        await conn.reply(m.chat, `error`, m)
        console.log(`❗❗ api (error) ❗❗`)
        console.log(e)
        handler.limit = false
    }
}

handler.help = ['igstory <username>']
handler.tags = ['downloader']
handler.command = ['igstory', 'igst', 'ighistorias']
handler.limit = 8
handler.register = true

export default handler