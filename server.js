require('dotenv').config()
const express = require('express');
const path = require('path');
const http = require('http');
const chat = require('./socket')
const mongoose = require('mongoose')

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));

// Run client

const start = async () => {
    try {
        await mongoose.connect(process.env.URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })

        chat(server)

        server.listen(PORT, () => {
            console.log(`Server runing on port ${PORT}`);
        })
    } catch (e) {
        console.log(e)
    }
}

start()


