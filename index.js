require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan  = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', function (request) {
  return JSON.stringify(request.body)
})

app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
))

app.get('/info', (request, response) => {
  const date = new Date()
  const content = '<p>Phonebook has info for ' + Person.length + ' people.</br>' + date + '</p>'

  response.send(content)
})

app.get('/api', (request, response) => {
  response.send('<h1>Phonebook API</h1>') // prints the argument to the route
})

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons.map(person =>
        person.toJSON() //returns a new array with every item mapped to a new object
      ))
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end() // returns error message 404 and no data
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body // deconstructed

  const person = new Person({ name, number })

  person
    .save()
    .then(savedPerson => savedPerson.toJSON()) // data is formatted
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body // deconstructed

  const person = { name, number }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

// error handling - must be called after data requests
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

// server port
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})