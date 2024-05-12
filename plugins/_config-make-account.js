import { createHash } from 'crypto';

const Reg = /\|?(.*)([.|] *?)([0-9]*) ([A-Za-z ]+)$/i;

const handler = async function (m, { conn, text, usedPrefix, command }) {
  const user = global.db.data.users[m.sender];
  const name2 = conn.getName(m.sender);
  const pp = await conn.profilePictureUrl(m.chat, 'image').catch((_) => global.imagen1);

  if (user.registered === true)
    throw `You are already registered\n\nDo you want to overwrite your registration?\n\n 📌Use the command ${usedPrefix}del-account <serial number>`;

  if (!Reg.test(text))
    throw `Example : ${usedPrefix + command} angelo.19 moroco`;

  let [_, name, splitter, age, country] = text.match(Reg);

  if (!name) throw 'Provide a valid name';
  if (!age) throw 'Specify the age for registration';
  if (!country) throw 'Specify the country for registration';

  if (name.length >= 10) throw 'The name is too long';
  age = parseInt(age);

  if (age > 80) throw 'How are you still alive with that age? 👴🏻';
  if (age < 11) throw 'A baby who knows how to use WhatsApp? 😲';

  user.name = name.trim();
  user.age = age;
  user.country = country.trim(); // Add country to user data
  user.regTime = new Date().toLocaleDateString(); // Set registration time to current date
  user.registered = true;

  const sn = createHash('md5').update(m.sender).digest('hex');

  const caption = `*Name :* ${name}
*Age :* ${age} years
*Country :* ${country}
*Registration Time :* ${user.regTime}
*Number serie :* 
${sn}`;

  await conn.sendFile(m.chat, pp, 'mystic.jpg', caption);

  global.db.data.users[m.sender].limit += 100;
  global.db.data.users[m.sender].exp += 10000;
};

handler.help = ['verify'];
handler.tags = ['xp'];
handler.command = /^(verify|make-account)$/i;

export default handler;



