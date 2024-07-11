const express = require('express');
const axios = require('axios');


const app = express();
const port = process.env.PORT || 9876;


let numbers = [];
let prevState = [];

const apiEndpoints = {
    p: 'http://20.244.56.144/test/primes',
    f: 'http://20.244.56.144/test/fibo',
    e: 'http://20.244.56.144/test/even',
    r: 'http://20.244.56.144/test/rand'
};

app.get('/numbers/:numberId', async (req, res) => {
    const numberId = req.params.numberId;
    const endpoint = apiEndpoints[numberId];
    if (!endpoint) {
        return res.status(404).json({ error: 'Invalid number ID' });
    }

    prevState = [...numbers];

    try {
        const response = await axios.get(endpoint, {
            timeout: 500,
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIwNjc5ODY1LCJpYXQiOjE3MjA2Nzk1NjUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImZkMzliNjJiLTMxMzUtNGU3NS1iNDNlLTcyMzA2Njc0MmNhOSIsInN1YiI6InRoYXJ1bmt1bWFya2FsdXZha3VyaUBnbWFpbC5jb20ifSwiY29tcGFueU5hbWUiOiJUaGFydW5fQWZmb3JtZWQiLCJjbGllbnRJRCI6ImZkMzliNjJiLTMxMzUtNGU3NS1iNDNlLTcyMzA2Njc0MmNhOSIsImNsaWVudFNlY3JldCI6IkR4SGdQZkloQnp5aG16bU8iLCJvd25lck5hbWUiOiJUaGFydW4iLCJvd25lckVtYWlsIjoidGhhcnVua3VtYXJrYWx1dmFrdXJpQGdtYWlsLmNvbSIsInJvbGxObyI6IlIyMUVGMjcwIn0.Ziw5MZdQQ3CdHIoZVtK95f3wfAgAQmfTRR5lvjEWRTY"
            }
        });
        numbers = [...numbers, ...response.data.numbers].slice(-10);  // Keep only the last 10 numbers
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch number from external API', details: error.message });
    }

    const average = numbers.reduce((acc, cur) => acc + cur, 0) / numbers.length;
    res.json({
        windowPrevState: prevState,
        windowCurrState: numbers,
        numbers,
        avg: average.toFixed(2)
    });
});

app.listen(port, () => {
    console.log("Server running on http://localhost:${port}");
});
