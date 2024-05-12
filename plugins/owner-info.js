import { promises } from 'fs';
import { join } from 'path';
import axios from 'axios';

let handler = async function (m, { conn, __dirname }) {
  const githubRepoURL = 'https://github.com/Guru322/GURU-BOT';

  try {
    const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);

    const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);

    if (response.status === 200) {
      const repoData = response.data;

      const formattedInfo = `
Owner : Angelo
Users : ${repoData.forks_count}
URL : wa.me/212621851554
Price for Premium :
Month : 3$
Year : 36$
      `.trim();

      await conn.relayMessage(m.chat, {
        requestPaymentMessage: {
          currencyCodeIso4217: 'INR',
          amount1000: 0000,
          requestFrom: m.sender,
          noteMessage: {
            extendedTextMessage: {
              text: formattedInfo,
              contextInfo: {
                externalAdReply: {
                  showAdAttribution: true
                }
              }
            }
          },
          buttons: [
            { buttonId: 'decline', buttonText: { displayText: 'Decline' }, type: 1 },
            { buttonId: 'pay', buttonText: { displayText: 'Pay' }, type: 1 }
          ]
        }
      }, {});

      if (m.selectedButtonId === 'pay') {
        await conn.reply(m.chat, '.buy', m);
      }

    } else {
      await conn.reply(m.chat, 'Unable to fetch repository information.', m);
    }
  } catch (error) {
    console.error(error);
    await conn.reply(m.chat, 'An error occurred while fetching repository information.', m);
  }
};

handler.help = ['script'];
handler.tags = ['main'];
handler.command = ['infobot'];

export default handler;
