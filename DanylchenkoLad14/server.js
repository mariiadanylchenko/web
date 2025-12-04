const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "pages"))); 

app.get("/", (req, res) => {
  res.send(`
    <h1>Лабораторні роботи з WEB</h1>
    <ul>
      <li><a href="/DanylchenkoLab14-1.html">ЛЗ 1.14 – Завдання 1</a></li>
      <li><a href="/DanylchenkoLab14-2.html">ЛЗ 1.14 – Завдання 2</a></li>
    </ul>
  `);
});

app.get("/bootstrap/layout1", (req, res) => {
  res.sendFile(path.join(__dirname, "pages/DanylchenkoLab14-1.html"));
});

app.get("/bootstrap/layout2", (req, res) => {
  res.sendFile(path.join(__dirname, "pages/DanylchenkoLab14-2.html"));
});

app.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}`);
});
