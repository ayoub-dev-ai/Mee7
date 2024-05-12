let handler = async (m, {
    conn,
    args,
    usedPrefix,
    command
}) => {
    conn.math = conn.math ? conn.math : {}
    const buttons = Object.keys(modes).map(v => [v, `${usedPrefix}${command} ${v}`])
    if (args.length < 1) return conn.reply(m.chat, `
  Mode: ${Object.keys(modes).join(' | ')}
  Contoh penggunaan: ${usedPrefix}math medium
  `.trim(), m)
    let mode = args[0].toLowerCase()
    if (!(mode in modes)) return conn.reply(m.chat, `
  Mode: ${Object.keys(modes).join(' | ')}
  Contoh penggunaan: ${usedPrefix}math medium
    `.trim(), m)
    let id = m.chat
    if (id in conn.math) return conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.math[id][0])
    let math = genMath(mode)
    conn.math[id] = [
        await conn.reply(m.chat, `Berapa hasil dari *${math.str}*?\n\nTimeout : ${(math.time / 1000).toFixed(2)} detik\nBonus Jawaban Benar: ${math.bonus} XP`, m),
        math, 4,
        setTimeout(() => {
            if (conn.math[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah ${math.result}`, conn.math[id][0])
            delete conn.math[id]
        }, math.time)
    ]
}
handler.help = ['math'].map(v => v + ' <mode>')
handler.tags = ['game']
handler.command = /^math/i
handler.register = true

let modes = {
    noob: [-3, 3, -3, 3, '+-', 1500, 10],
    easy: [-10, 10, -10, 10, '*/+-', 6000, 40],
    medium: [-40, 40, -20, 20, '*/+-', 10000, 150],
    hard: [-999999, 999999, -999999, 999999, '*/+-', 10000, 20000, 20000, 40000,  30000],
}

let operators = {
    '+': '+',
    '-': '-',
    '*': '×',
    '/': '÷'
}

function genMath(mode) {
    let [a1, a2, b1, b2, ops, time, bonus] = modes[mode]
    let a = randomInt(a1, a2)
    let b = randomInt(b1, b2)
    let op = pickRandom([...ops])
    let result = (new Function(`return ${a} ${op.replace('/', '*')} ${b < 0 ? `(${b})` : b}`))()
    if (op == '/')[a, result] = [result, a]
    return {
        str: `${a} ${operators[op]} ${b}`,
        mode,
        time,
        bonus,
        result
    }
}

function randomInt(from, to) {
    if (from > to)[from, to] = [to, from]
    from = Math.floor(from)
    to = Math.floor(to)
    return Math.floor((to - from) * Math.random() + from)
}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

handler.modes = modes

export default handler
