const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, password], (err) => {
    if (err) {
      return res.send('Error al registrar el usuario');
    }
    res.redirect('/login');
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, user) => {
    if (err || !user) {
      return res.send('Correo o contraseña incorrectos');
    }
    res.redirect('/tasks');
  });
});

app.get('/tasks', (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, tasks) => {
    if (err) {
      return res.send('Error al obtener las tareas');
    }
    res.render('tasks', { tasks });
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
