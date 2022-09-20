const http = require('http');
const url = require("url");
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url).pathname;
    const parsed = url.parse(req.url, true);
    if(reqUrl === '/rates') {
        res.setHeader('Content-Type', 'application/json');
        const query = parsed.query;
        if (!query.currency) {
            res.end(JSON.stringify({ message: 'use /rates?currency=COIN_NAME' }));
        }

        axios
            .get(`${process.env.COINCAP_API_URL}/${process.env.COINCAP_API_VERSION}/rates/${query.currency}`)
            .then(response => {
                if (response.data.data && response.data.data.rateUsd) {
                    res.end(JSON.stringify({ usd: response.data.data.rateUsd }));
                } else {
                    res.statusCode = 404;
                    res.end(JSON.stringify({ message: 'error' }));
                }
            })
            .catch(() => {
                res.statusCode = 404;
                res.end(JSON.stringify({ message: 'error' }));
            });
    }
});

server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`server started on ${process.env.SERVER_PORT} port`);
});