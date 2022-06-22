require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')

/*
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

morgan.token('content', function (req,res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
*/

app.use(express.static('build'))

app.use(express.json())

app.get('/', (request, response) => {
    response.send(`
    <div>
    <p>For phonebook data, navigate to ./api/persons</p>
    <p>For phonebook stats, navigate to ./info</p>
    </div>
    `)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
        .catch(error => console.log(error.message))
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
    }

    newPerson = new Person({
        name: body.name,
        number: body.number
    })
    
    newPerson.save().then(savedEntry => {
        response.json(savedEntry)
    })
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

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})