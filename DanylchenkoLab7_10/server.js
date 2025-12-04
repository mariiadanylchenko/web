const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "pages")));

app.get("/", (req, res) => {
    res.send(`
        <h1>Сервер</h1>
        <ul>
            <li><a href="/DanylchenkoLab07-1.html">Сторінка 1 (форма)</a></li>
            <li><a href="/DanylchenkoLab07-2.html">Сторінка 2 (всі елементи)</a></li>
            <li><a href="/DanylchenkoLab07-3.html">Сторінка 3 (анкета)</a></li>
            <li><a href="/DanylchenkoLab07-4.html">Сторінка 4 (замовлення товару)</a></li>
            <li><a href="/DanylchenkoLab10-1.html">Макет Float</a></li>
            <li><a href="/DanylchenkoLab10-2.html">Макет Flexbox</a></li>
            <li><a href="/DanylchenkoLab10-3.html">Макет Grid</a></li>
        </ul>
    `);
});

app.get("/lab1", (req, res) => res.sendFile(path.join(__dirname, "pages/DanylchenkoLab07-1.html")));
app.get("/lab2", (req, res) => res.sendFile(path.join(__dirname, "pages/DanylchenkoLab07-2.html")));
app.get("/lab3", (req, res) => res.sendFile(path.join(__dirname, "pages/DanylchenkoLab07-3.html")));
app.get("/lab4", (req, res) => res.sendFile(path.join(__dirname, "pages/DanylchenkoLab07-4.html")));

app.get("/float", (req, res) => res.sendFile(path.join(__dirname, "pages/DanylchenkoLab10-1.html")));
app.get("/flex", (req, res) => res.sendFile(path.join(__dirname, "pages/DanylchenkoLab10-2.html")));
app.get("/grid", (req, res) => res.sendFile(path.join(__dirname, "pages/DanylchenkoLab10-3.html")));

app.listen(PORT, () => {
    console.log(`Сервер запущено: http://localhost:${PORT}`);
});
