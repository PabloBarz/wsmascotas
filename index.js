const express = require('express') //Framework
const mysql = require('mysql2') //Acceso DB
const bodyParser = require('body-parser') //Interactuar con JSON

const app = express()
app.use(bodyParser.json())

//Configuración de acceso a la BD - env 
const db = mysql.createConnection({
  host: 'localhost',
  user:'root',
  password:'',
  database:'dbmascotas'
})

//Aperturar la conexión
db.connect((err) => {
  if (err) throw err;
  console.log("Conectado a la BD mascotas")
})

//Iniciar el servidor
const PORT = 3000

//--SERVICIOS WEB--
//VERBO = ACCIÓN = INTENCIÓN
//GET     : LEER
//POST    : CREAR
//PUT     : ACTUALIZAR
//PATCH   : ACTUALIZACIÓN PARCIALg
//DELETE  : ELIMINAR

//req (require, requerimiento)
//res (response, respuesta)
app.post('/mascotas', (req, res) => {
  //¿Y los datos  que queremos guardar? - DESEREALIZACIÓN
  const { tipo, nombre, color, pesokg } = req.body

  //? = comodín, evita los ataque por SQLinjection
  const sql = "INSERT INTO mascotas (tipo, nombre, color, pesokg) VALUES (?,?,?,?)"

  db.query(sql, [tipo, nombre, color, pesokg], (err, results) => {
    if (err) {
      return res.status(500).send({
      success: false,
      message: 'No se concretó el registro'
      })
    }

    //¿Qué hacemos cuando logramos registrar?
    res.send({
        success: true,
        message: 'Nueva mascota registrada',
        id: results.insertId
    })
  })
})

app.get('/mascotas', (req, res) => {
  const sql = "SELECT * FROM mascotas"
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send({mesagge: ' Error acceso a datos'})
    res.json(results)
  })
  //res.send({ 'proceso' : 'GET'})
})

app.put('/mascotas/:id', (req, res) => {
  const { id } = req.params
  const { tipo, nombre, color, pesokg } = req.body
  //Podemos escribir multilineas usando " ` => ALT GR + } "
  //Comodines van en un índice
  const sql = `
  UPDATE mascotas SET 
  tipo = ?, nombre = ?, color = ?, pesokg = ?
  WHERE id = ?`;

  db.query(sql, [tipo, nombre, color, pesokg, id], (err, results) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: 'No se concretó la actualización '
      })
    }

    return res.send({
      success: true,
      message: 'Registro actualizado'
    })
  })
})

//En un WS para eliminar un registro, pasamos la PK como parte de la ruta
//Ejemplo : DELETE - miwebservice.com/clientes/19
app.delete('/mascotas/:id', (req, res) => {
  //¿De donde obtenemos el id a borrar? => ENDPOINT (URL)
  const { id } = req.params
  const sql  =  "DELETE FROM mascotas WHERE id = ?"
  db.query(sql, [id], (err, results) => {
    //Cláusula de GUARDA / retorno temprano 
    if (err){
      res.status(500).send({
        success: false,
        message: 'No se puede eliminar el registro'
      })
    }

    if (results.affectedRows == 0){
      return res.status(404).send({
        success: false, 
        message: 'No existe la mascota'
      })
    }

    return res.send({
      success: true,
      message: 'Eliminado correctamente'
    })

  })
})

app.get('/mascotas/:id', (req, res) => {
  const { id } = req.params; 

  const sql = "SELECT * FROM mascotas WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).send({
        success: false,
        message: 'Error al acceder a la base de datos'
      });
    }

    if (results.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No se encontró la mascota'
      });
    }

    return res.send({
      success: true,
      mascota: results[0]
    });
  });
});


app.listen(PORT, () => {
  console.log("Servidor iniciado correctamente en http://localhost:3000")
})