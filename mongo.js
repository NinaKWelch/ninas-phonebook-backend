const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
`mongodb+srv://nina_01:${password}@cluster0-itgkm.mongodb.net/fullstack?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv.length === 5) {
  const person = new Person({ name, number }) // decostructed name: name, number: number

  person
    .save()
    .then(() => {
      console.log(`Added ${person.name} number ${person.number} to phonebook`)
      mongoose.connection.close()
    })
} else if (process.argv.length === 3) {
  console.log('Phonebook:')

  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
} else {
  console.log('Give your password or password, persons name and number as arguments, in that order')
  process.exit(1)
}