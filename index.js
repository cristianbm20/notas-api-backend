const express = require('express')
const app = express()
const logger = require('./loggerMiddleware')
const cors = require('cors')

app.use(express.json())
app.use(logger)
app.use(cors())

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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
