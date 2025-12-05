const express = require("express");
const path = require("path");

const app = express();
const PORT = 4000;

app.use(express.static(path.join(__dirname, "/pages")));

app.get("/", (req, res) => {
  res.send(`
    <h1>Лабораторні роботи</h1>
    <ul>
      <li><a href="/DanylchekoLab14-1.html">Завдання 1</a></li>
      <li><a href="/DanylchekoLab14-2.html">Завдання 2</a></li>
    </ul>
  `);
});

app.get("/lab14/1", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "DanylchekoLab14-1.html"));
});

app.get("/lab14/2", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "DanylchekoLab14-2.html"));
});

app.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}`);
});
