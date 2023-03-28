const express = require('express')
const app = express()
const logger = require('./loggerMiddleware')
const cors = require('cors')
// Modulos necesarios para conexion https
const https = require('https')
const fs = require('fs')

app.use(express.json())
app.use(logger)
app.use(cors())

// Cargamos certificado y clave privada
const privateKey = fs.readFileSync('/Applications/XAMPP/etc/ssl.key/server.key', 'utf8')
const certificate = fs.readFileSync('/Applications/XAMPP/etc/ssl.crt/server.crt', 'utf8')

const credentials = {
  key: privateKey,
  cert: certificate
}

app.get('/api/fechaActual', (req, res) => {
  const fechaActual = new Date()
  res.send(`<h1>Fecha y hora actual</h1>
  <p>${fechaActual}</p>`)
})

let notas = [
  {
    id: 1,
    content: 'contenido de la primera nota',
    date: '2022-12-13T18:00:00',
    important: true
  },
  {
    id: 2,
    content: 'contenido de la segunda nota',
    date: '2022-12-14T15:30:00',
    important: false
  },
  {
    id: 3,
    content: 'contenido de la tercera nota',
    date: '2022-12-15T17:00:00',
    important: true
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>')
})

app.get('/api/notas', (req, res) => {
  res.json(notas)
})

app.get('/api/notas/:id', (req, res) => {
  const id = Number(req.params.id)
  const nota = notas.find(nota => nota.id === id)
  if (nota) {
    res.json(nota)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/notas/:id', (req, res) => {
  const id = Number(req.params.id)
  notas = notas.filter(nota => nota.id !== id)
  res.status(204).end()
})

app.post('/api/notas', (req, res) => {
  const nota = req.body
  if (!nota || !nota.content) {
    return res.status(400).json({
      error: 'nota.content esta vacio'
    })
  }
  const ids = notas.map(nota => nota.id)
  const maxId = Math.max(...ids)
  const nuevaNota = {
    id: maxId + 1,
    content: nota.content,
    important: typeof nota.important !== 'undefined' ? nota.important : false,
    date: new Date().toISOString()
  }
  notas = notas.concat(nuevaNota)
  res.status(201).json(nuevaNota)
})

app.use((req, res) => {
  res.status(404).json({
    error: 'not found'
  })
})

// Creamos server https
const httpsServer = https.createServer(credentials, app)

const PORT = process.env.PORT || 3001

httpsServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
