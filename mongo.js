const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = 
`mongodb+srv://nina_01:${password}@cluster0-itgkm.mongodb.net/fullstack?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })
  
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
    const person = new Person({
        name: name,
        number: number
    })
    
    person
        .save()
        .then(response => {
            console.log(`Added ${person.name} number ${person.number} to phonebook`);
            mongoose.connection.close();
    })
} else if (process.argv.length === 3) {
    console.log('Phonebook:')

    Person
        .find({})
        .then(result => {
            result.forEach(person => {
            console.log(person.name + ' ' + person.number)
            })
        mongoose.connection.close()
    })
} else {
    console.log('Give your password, and persons name and number as arguments, in that order')
    process.exit(1)
}