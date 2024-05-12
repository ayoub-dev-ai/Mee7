const handler = async (m, {conn, text, usedPrefix, command}) => {
  if (!text) throw `Ex :\n/support hello support help me`;
  if (text.length < 10) throw `الحد الأدنى للحروف في تقرير هوا عشرة`;
  if (text.length > 1000) throw `الحد الأقصى للحروف في تقرير هوا الف حرف`;
  const teks = `*❒═════[ SUPPORT ]═════❒*\n*Num : wa.me/${m.sender.split`@`[0]}*\n*support : ${text}*`;
  conn.reply('212607967755@s.whatsapp.net', m.quoted ? teks + m.quoted.text : teks, null, {contextInfo: {mentionedJid: [m.sender]}});
  m.reply(`تم ارسال تقرير لفريق البوت سيتم رد عليك في اقرب وقت`);
};
handler.help = ['reporte', 'request'].map((v) => v + ' <teks>');
handler.tags = ['info'];
handler.command = /^(support|تقرير)$/i;
handler.limit = 0
handler.register = true
export default handler;