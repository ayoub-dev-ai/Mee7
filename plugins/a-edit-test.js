const handler = async (m, {conn, usedPrefix, usedPrefix: _p, __dirname, text, isPrems}) => {
    if (usedPrefix == 'a' || usedPrefix == 'A') return;
    try {
        // let vn = './media/menu.mp3'
        const d = new Date(new Date + 3600000);
        const locale = 'es-ES';
        const week = d.toLocaleDateString(locale, {weekday: 'long'});
        const date = d.toLocaleDateString(locale, {day: '2-digit', month: '2-digit', year: 'numeric'});
        const _uptime = process.uptime() * 1000;
        const uptime = clockString(_uptime);
        const user = global.db.data.users[m.sender];
        const {money, joincount} = global.db.data.users[m.sender];
        const {exp, limit, level, role} = global.db.data.users[m.sender];
        const rtotalreg = Object.values(global.db.data.users).filter((user) => user.registered == true).length;
        const rtotal = Object.entries(global.db.data.users).length || '0'
        const more = String.fromCharCode(8206)
        const readMore = more.repeat(4001)
        const taguser = '@' + m.sender.split('@s.whatsapp.net')[0];
        const doc = ['pdf', 'zip', 'vnd.openxmlformats-officedocument.presentationml.presentation', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'vnd.openxmlformats-officedocument.wordprocessingml.document'];
        m.react('🌙');
        
        let menu = "Menu";

        // Your existing code for the handler function goes here
        let senderTag = m.pushName || conn.getName(m.sender);

        const buttonParamsJson = JSON.stringify({
            title: "Show Options",
            sections: [
                {
                    title: "Mee6",
                    highlight_label: "MENU",
                    rows: [
                        {
                            title: "All Command", 
                            id: `${usedPrefix}help`
                        },
                        { 
                            title: `${menu} Ai`, 
                            id: ``
                        }
                    ]
                }
            ]
        });

        const interactiveMessage = {
            body: { text: `Hello ${senderTag}` },
            footer: { text: "_Mee6_" },
            header: { title: ``, subtitle: "", hasMediaAttachment: false },
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

handler.command = /^(hipo2)$/i;
export default handler;

function clockString(ms) {
    let seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
    return `${hours}h ${minutes}m ${seconds}s`;
}