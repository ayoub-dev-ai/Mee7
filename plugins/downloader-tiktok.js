 
import fg from 'api-dylux'
import fetch from 'node-fetch'
let handler = async (m, { conn, text, args, usedPrefix, command }) => {
    
        if (!args[0]) throw `✳️ ${usedPrefix + command} https://vm.tiktok.com/ZMYG92bUh/`
        if (!args[0].match(/tiktok/gi)) throw `❎`
      
        try {
        let res = await fetch(global.API('fgmods', '/api/downloader/tiktok', { url: args[0] }, 'apikey'))
        let data = await res.json()

        if (!data.result.images) {
            let tex = `
▢ *name :* ${data.result.author.nickname}
▢ *username :* ${data.result.author.unique_id}
▢ *Likes :* ${data.result.digg_count}
▢ *views :* ${data.result.play_count}`
            conn.sendFile(m.chat, data.result.play, 'tiktok.mp4', tex, m);
        } else {
            let cap = `
▢ *Likes:* ${data.result.digg_count}
`
            for (let ttdl of data.result.images) {
                conn.sendMessage(m.chat, { image: { url: ttdl }, caption: cap }, { quoted: m })
            }
            conn.sendFile(m.chat, data.result.play, 'tiktok.mp3', '', m, null, { mimetype: 'audio/mp4' })
        }

      } catch (error) {
        m.reply(`❎ error`)
    }
   
}

handler.help = ['tiktok']
handler.tags = ['dl']
handler.command = ['tiktok']
export default handler