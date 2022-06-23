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

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).send({ error: 'There is no note in the database with the given id' })
            }
    })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const replacement = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, replacement, { new : true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.get('/info', (request,response, next) => {
    Person.estimatedDocumentCount()
        .then(count => {
            response.send(
                `<div>
                <p>Phonebook has info for ${count} people</p>
                <p>${new Date()}</p>
                </div>`
            )
        })
        .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})