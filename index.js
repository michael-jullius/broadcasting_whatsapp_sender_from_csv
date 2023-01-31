import wa from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import fs from "fs";
import csv from "csv-parser";

const { Client, LocalAuth } = wa;
const client = new Client({
    authStrategy: new LocalAuth()
});

let number = [];

fs.createReadStream("./number.csv")
    .pipe(csv())
    .on("data", (data) => {
        number.push(data);
    })
    .on("end", () => {
        console.log("CSV file successfully processed");
    });

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', (session) => {
    console.log('Authenticated', session);
});
client.on('ready', () => {
    console.log('Client is ready!');
    for (let i in number) {
        try {
            client.sendMessage(`${number[i].no}@c.us`, `${number[i].nama}`);
            console.log(`${number[i].no}` + " success")
        } catch (error) {
            console.log(error);
        }

    }

});

client.on('message', message => {
    if (message.body === '!ping') {
        message.reply('pong');
    }
});

client.initialize();
