/* MYSQL STUFF */
const mysql = require('mysql');
const connection = mysql.createConnection({
  user: 'root',
  password: '',
  database: 'todoapp',
  host: 'localhost'
});

connection.connect();

/* ROUTES VARS */
const express = require('express');
const app = express();

/* MIDDLEWARES */
/* Se corren ANTES que cualquier route */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next(); // ejecuta el route o el proximo middleware
});


/* ROUTES */
// testing que el servidor responde
app.get('/', (req, res) => res.end("hi"));


// todos los registros
app.get('/tasks', (req, res) => {
  connection.query('SELECT * FROM tasks', (err, rows) => {
    if(err) res.end('error in get route for tasks');
    else res.end(JSON.stringify(rows));
  });
});


// todos los registros de un user id determinado
app.get('/user_id/:id', (req, res) => {
  connection.query(`SELECT * FROM tasks WHERE user_id = '${req.params.id}'`, (err, rows) => {
    if(err) res.end('error trying to access to route USER');
    else res.end(JSON.stringify(rows));
  });
});


// todos los registros de un user status determinado
app.get('/user_status/:status', (req, res) => {
  connection.query(`SELECT * FROM tasks WHERE status = '${req.params.status}'`, (err, rows) => {
    if(err) res.end('error trying to access to route USER');
    else res.end(JSON.stringify(rows));
  });
});


// actualizar el status de un task
app.put('/update_task/:id/:new_status', (req, res) => {
  connection.query(`UPDATE tasks SET status = '${req.params.new_status}' WHERE id = '${req.params.id}'`, (err, dbres) => {
    if(err) res.end('error trying to modify the element');
    else res.json(dbres);
  });
});


// eliminar una determinada task
app.put('/delete/:id', (req, res) => {
  connection.query(`DELETE FROM tasks WHERE id = '${req.params.id}'`, (err, dbres) => {
    if(err) res.end('error trying to delete the element');
    else res.json(dbres);
  });
});


// post para insertar un nuevo registro
app.post('/tasks/:desc/:uid/:status', (req, res) => {
  connection.query(`INSERT INTO tasks(description, user_id, status)
                  VALUES('${req.params.desc}', '${req.params.uid}', '${req.params.status}')`,
                  (err, dbres) => {
                    if(err) res.end('error in posting task route');
                    else res.json(dbres);
                  });
});


/* COLOCACION DEL SERVIDOR */
// puerto por el cual trabaja el servidor
app.listen(9999, () => console.log('server running at port 9999'));
