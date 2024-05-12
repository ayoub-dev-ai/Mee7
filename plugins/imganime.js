import axios from 'axios';
import uploadFile from '../lib/uploadFile.js';
import uploadImage from '../lib/uploadImage.js';
import fetch from 'node-fetch';

const wait = "Please wait...";
const waitt = "Please wait some more...";
const waittt = "Still waiting...";
const waitttt = "Almost done...";

let handler = async (m, {
    command,
    usedPrefix,
    conn,
    text,
    args
}) => {
    
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime) throw 'Send the image and write on it\n*/imganime*';
    let media = await q.download();
    let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
    let link = await (isTele ? uploadImage : uploadFile)(media);

    const { key } = await conn.sendMessage(m.chat, {text: wait});
    await conn.sendMessage(m.chat, {text: waitt, edit: key});
    await conn.sendMessage(m.chat, {text: waittt, edit: key});
    await conn.sendMessage(m.chat, {text: waitttt, edit: key});
    try {
        const openAIResponse = await processImageAndUpload(link);

        if (openAIResponse) {
            const result = openAIResponse;
            const tag = `@${m.sender.split('@')[0]}`;

            await conn.sendMessage(m.chat, {
                image: {
                    url: result
                },
                caption: `Done ${tag}`,
                mentions: [m.sender]
            }, {
                quoted: m
            });
        } else {
            console.log("An issue occurred.");
        }
    } catch (e) {
        await m.reply('')
    }
}
handler.command = /^(imganime)$/i;
export default handler;

async function processImageAndUpload(urlImage) {
    try {
        const response = await axios.get(urlImage, {
            responseType: 'arraybuffer',
        });

        const base64String = Buffer.from(response.data, 'binary').toString('base64');

        const apiResponse = await axios.post('https://www.drawever.com/api/photo-to-anime', {
            data: `data:image/png;base64,${base64String}`,
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return 'https://www.drawever.com' + apiResponse.data.urls[1] || 'https://www.drawever.com' + apiResponse.data.urls[0];
    } catch (error) {
        throw error;
    }
}

