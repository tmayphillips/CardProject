const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
// const models = require('./models')
const mtg = require('mtgsdk')

app.engine('mustache',mustacheExpress())
app.use(bodyParser.urlencoded({ extended: false }))
app.set('views','./views')
app.set('view engine','mustache')

// mtg.card.find(3)
// .then(result => {
//     console.log(result.card.name) // "Black Lotus"
// })



app.post('/view-card',(req,res) => {
    let cardName = req.body.cardName
    // mtg.card.all({ name: 'Squee', pageSize: 1 })
    // .on('data', card => {
    //     console.log(card)
    // // res.render('view-card',{card: card})
    // console.log(card.name)
    // })
    mtg.card.where({ name: `${cardName}`})
    .then(cards => {
        res.render('view-card',{cards: cards})
        console.log(cards)
    })

    // mtg.card.where({ supertypes: 'legendary', subtypes: 'goblin' })
    // .then(cards => {
    //     res.render('view-card',{cards: cards})
    //     console.log(cards[0].name) // "Squee, Goblin Nabob"
    // })

    // mtg.card.find(439314)
    // .then(result => {
    // res.render('view-card',{card: result})
    // console.log(result.card.name) // "Black Lotus"
    // })
})
app.get('/view-card',(req,res) => {
    res.render('view-card')
})

app.get('/search-cards',(req,res) => {
    res.render('search-cards')
})

app.listen(3000,function(){
    console.log("Server sure is humming!")
  })