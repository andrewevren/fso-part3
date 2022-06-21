const express = require('express')
const app = express()

const morgan = require('morgan')

app.use(express.static('build'))

app.use(express.json())

morgan.token('content', function (req,res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send(`
    <div>
    <p>For phonebook data, navigate to ./api/persons</p>
    <p>For phonebook stats, navigate to ./info</p>
    </div>
    `)
})

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = phonebook.find(n => n.id === id)

    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    } else if (phonebook.find(n => n.name.toLowerCase() === body.name.toLowerCase())) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    newPerson = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000000)
    }
    
    phonebook = phonebook.concat(newPerson)
    response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    
    phonebook = phonebook.filter(n => n.id !== id)
    response.status(204).end()
})

app.get('/info', (request,response) => {
    response.send(`
        <div>
        <p>Phonebook has info for ${phonebook.length} people</p>
        <p>${new Date()}</p>
        </div>
    `)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})