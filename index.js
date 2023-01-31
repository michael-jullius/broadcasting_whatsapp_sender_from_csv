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
    for (let data of number) {
        try {
            client.sendMessage(`${data.no}@c.us`, `${data.nama}`);
            console.log(`${data.no} success`)
        } catch (error) {
            console.log(`${data.no} failed`);
        }

    }

});

client.on('message', message => {
    if (message.body === '!ping') {
        message.reply('pong');
    }
});

client.initialize();
