const request = require('supertest');
const express = require('express');

const app = express();

const port = 8080;

app.get('/', (req, res) => {
    res.send('Hello World!');
});


describe('Node.js Express Application Tests', () => {

    test('GET / should return Hello World', async () => {

        const response = await request(app).get('/');

        expect(response.statusCode).toBe(200);

        expect(response.text).toBe('Hello World!');

    });

});
