let handler = m => m // Initialize a handler function that returns the received message

// Define a 'before' method for the handler function
handler.before = async function(m) {
    // Check if the received message text matches a number pattern
    if (!/^-?[0-9]+(\.[0-9]+)?$/.test(m.text)) return !0

    // Get the ID of the chat where the message was received
    let id = m.chat

    // Check if the received message is a reply, sent by the bot, and matches a specific pattern
    if (!m.quoted || !m.quoted.fromMe || !m.text || !/^Berapa hasil dari/i.test(m.quoted.text)) return !0

    // Initialize or retrieve the math object associated with the chat ID
    this.math = this.math ? this.math : {}
    if (!(id in this.math)) return this.reply(m.chat, 'Soal itu telah berakhir', m)

    // Check if the replied message ID matches the stored ID in the math object
    if (m.quoted.id == this.math[id][0].id) {
        // Deep clone the stored math object
        let math = JSON.parse(JSON.stringify(this.math[id][1]))

        // Check if the received message text matches the stored result
        if (m.text == math.result) {
            // If the answer is correct, update the user's experience points, clear timeout, and delete the math object
            global.db.data.users[m.sender].exp += math.bonus
            clearTimeout(this.math[id][3])
            delete this.math[id]
            this.reply(m.chat, `✅ *Correct!*\n+${math.bonus} XP`, m)
        } else {
            // If the answer is incorrect, decrement the remaining attempts
            if (--this.math[id][2] == 0) {
                // If no attempts left, clear timeout and delete the math object
                clearTimeout(this.math[id][3])
                delete this.math[id]
                this.reply(m.chat, `❗ *Out of attempts!*\nAnswer : *${math.result}*`, m)
            } else 
                // If attempts remain, inform the user about the incorrect answer and remaining attempts
                m.reply(`❌ *Wrong answer!*\nStill ${this.math[id][2]} attempts remaining`)
        }
    }
    return !0
}

// Export the handler function
export default handler
