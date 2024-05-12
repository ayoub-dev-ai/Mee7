import jimp from 'jimp'
import PhoneNumber from 'awesome-phonenumber'
import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg;

let handler = async (m, {conn, usedPrefix, usedPrefix: _p, __dirname, text, isPrems}) => {
    if (usedPrefix == 'a' || usedPrefix == 'A') return;
    try {
        let senderTag = m.pushName || conn.getName(m.sender);
        let icon_sander = await genProfile(conn, m);
m.react('📚')
        const buttonParamsJson = JSON.stringify({
            title: "عرض الميزات",
            sections: [
                {
                    title: "< لاكتر الشهرة />",
                    rows: [
                        {
                            title: "الاوامر المدفوعة", 
                            id: `${usedPrefix}prem`
                        },
                        { 
                            title: "اوامر الحساب", 
                            id: `${usedPrefix}acc`
                        }
                    ]
                },
                {
                    title: "< اوامر التحميل />",
                    rows: [
                        { 
                            title: "اوامر التحميل", 
                            id: `${usedPrefix}down`
                        },
                    ]
                },
                {
                    title: "< اوامر الدكاء الاصطناعي />",
                    rows: [
                        { 
                            title: "جميع الاوامر", 
                            id: `${usedPrefix}ai-menu`
                        },
                        {
                            title: "اوامر اسلامية", 
                            id: `${usedPrefix}islam`
                        }
                    ]
                },
                {
                    title: "< اخر />",
                    rows: [
                        { 
                            title: "اوامر اخرﻯ", 
                            id: `${usedPrefix}other`
                        },
                        { 
                            title: "معلومات الحساب", 
                            id: `${usedPrefix}info`
                        }
                    ]
                },
                {
                    title: "< جاديبوت />",
                    rows: [
                        { 
                            title: "جاديبوت", 
                            id: `${usedPrefix}jadibot`
                        }
                    ]
                }
            ]
        });

        const interactiveMessage = {
            body: { text: `Hello 👋, ${senderTag}` },
            footer: { text: "@dalich._.98" },
            header: {hasMediaAttachment: true,
            ...await prepareWAMessageMedia({
            image: await genProfile(conn, m) }, {
            upload: conn.waUploadToServer })
            },
            nativeFlowMessage: { 
                buttons: [{ 
                    name: "single_select",
                    buttonParamsJson
                }]
            }
        };

        const message = { 
            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 }, 
            interactiveMessage 
        };

        await conn.relayMessage(m.chat, { viewOnceMessage: { message } }, {});
    } catch (e) {
        console.log(e)
    }
};

handler.command = /^(help|menu)$/i;
export default handler;

async function genProfile(conn, m) {
  let font = await jimp.loadFont('./names.fnt'),
    mask = await jimp.read('https://i.imgur.com/552kzaW.png'),
    welcome = await jimp.read(thumbnailUrl.getRandom()),
    avatar = await jimp.read(await conn.profilePictureUrl(m.sender, 'image').catch(() => 'https://telegra.ph/file/24fa902ead26340f3df2c.png')),
    status = (await conn.fetchStatus(m.sender).catch(console.log) || {}).status?.slice(0, 30) || 'Not Detected'

    await avatar.resize(460, 460)
    await mask.resize(460, 460)
    await avatar.mask(mask)
    await welcome.resize(welcome.getWidth(), welcome.getHeight())

    await welcome.print(font, 550, 180, 'Name :')
    await welcome.print(font, 650, 255, m.pushName.slice(0, 25))
    await welcome.print(font, 550, 340, 'About :')
    await welcome.print(font, 650, 415, status)
    await welcome.print(font, 550, 500, 'Number :')
    await welcome.print(font, 650, 575, PhoneNumber('+' + m.sender.split('@')[0]).getNumber('international'))
    return await welcome.composite(avatar, 50, 170).getBufferAsync('image/png')
}