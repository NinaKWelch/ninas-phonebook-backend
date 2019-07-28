require('dotenv').config()

const express = require('express')
const app = express()
const Person = require('./models/person')
const bodyParser = require('body-parser')
const morgan  = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())

morgan.token('body', function (request) { return JSON.stringify(request.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors())
app.use(express.static('build'))

/*
let persons = [
    {
        name: 'Arto Hellas',
        number: '040-123456',
        id: 1
    },
    {
        name: 'Ada Lovelace',
        number: '39-44-5323523',
        id: 2
    },
    {
        name: 'Dan Abramov',
        number: '12-43-234345',
        id: 3
    },
    {
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
        id: 4
    }
]
*/

app.get('/info', (request, response) => {
    const date = new Date()
    const content = '<p>Phonebook has info for ' + persons.length + ' people.</br>' + date + '</p>'

    response.send(content)
})

app.get('/api', (request, response) => {
    response.send('<h1>Phonebook API</h1>') // prints the argument to the route
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons.map(person => person.toJSON())) //returns a new array with every item mapped to a new object
    });    
})

/*
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (!person) {
        response.status(404).end() // returns error message 404 and no data
    } 

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 10000 + 1)
    }

    const samePerson = persons.some(person => person.name === body.name)

    if (samePerson) {
        return response.status(205).json({
            error: 'name must be unique'
        })
    } else if (!body.name || !body.number) {
        return response.status(206).json({
            error: 'missing name or number'
          })
    }

    persons.concat(person)

    response.json(person)
})
*/

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const PORT = process.env.PORT // server port

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`) 
})