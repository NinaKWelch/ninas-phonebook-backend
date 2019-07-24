const express = require('express')
const app = express()

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

app.get('/api', (request, response) => {
    response.send('<h1>Phonebook API</h1>') // prints the argument to the route
})

app.get('/info', (request, response) => {
    const date = new Date()
    const content = '<p>Phonebook has info for ' + persons.length + ' people.</br>' + date + '</p>'

    response.send(content)
})

app.get('/api/persons', (request, response) => {
    response.json(persons) // json string that corresponds to javaScript persons object
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end() // returns error message 404 and no data
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = 3001 // server port

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`) 
})