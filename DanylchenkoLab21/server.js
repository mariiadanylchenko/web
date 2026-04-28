'use strict';

const express = require('express');
const path    = require('path');

const app  = express();
const PORT = 3021;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname)));

app.post('/square', (req, res) => {
  const raw = req.body.number;
  const n   = Number(raw);

  if (raw === undefined || raw === '' || isNaN(n)) {
    return res.status(400).json({ error: 'Введіть коректне число.' });
  }

  const square = n * n;

  res.json({
    number:  n,
    square:  square,
    message: `Квадрат числа ${n} дорівнює ${square}`,
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}`);
});
