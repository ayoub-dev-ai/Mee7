import fetch from 'node-fetch';

const ignoredWords = [
    'apk', 'apkpure', 'apk2', 'obb', 'mediafire', 'imganime2', 'imagine', 
    'make-account', 'support', 'serie', 'del-account', 'transfer', 'info', 
    'buy', 'levelup', 'gift', 'play', 'ytmp4', 'ytmp3', 'fb', 'igstory', 'mega', 
    'yts', 'spotify', 'ig', 'img', 'tiktok', 'imagine', 'imganime', 'hdr', 
    'bard', 'bardimg', 'ai', 'chatgpt', 'hdr', 'pdf', 'pdfurl', 'removegb', 'tr', 
    'cuturl', 'cartoon', 'tourl', 'sticker', 'attp', 'bot', 'id', 'gpt4', 'tomp3', 
    'qr', 'zombie', 'emojimix', 'tts', 'whatsapp', 'book', 'ecole', 'enc', 'math', 
    'jadibot', 'owner', 'welcome', 'top', 'dalich', 'adhan', 'Advice', 'asmaeallah', 
    'hadiths', 'qranayati', 'mee7', 'ayati', 'qra'
];

const handler = async (m, { conn, text }) => {
    try {
        // Check if the text contains any of the ignored words
        const containsIgnoredWord = ignoredWords.some(word => text.toLowerCase().includes(word.toLowerCase()));
        if (containsIgnoredWord) {
            return;
        }

        // Encode text for URL
        const encodedText = encodeURIComponent(text);

        // Make the fetch request
        const response = await fetch(`https://aemt.me/gpt4?text=${encodedText}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status && data.result) {
            const result = `Hello\n\n${data.result}\n\nBy Mee#`;
            conn.reply(m.chat, result, m);
        } else {
            throw new Error('Invalid response from the server');
        }
    } catch (error) {
        console.error('Error in handler:', error);
        conn.reply(m.chat, 'An error occurred while processing the request.', m);
    }
};

handler.all = async (m, { conn }) => {
    await handler(m, { conn, text: m.text });
};

export default handler;
