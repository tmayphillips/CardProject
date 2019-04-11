const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const models = require('./models')
const mtg = require('mtgsdk')
const sequelize = require('sequelize')
const pgp = require('pg-promise')()
const sequelizePaginate = require('sequelize-paginate')
const paginate = require('express-paginate')
var ejs = require('ejs')
var mongoose = require('mongoose')
const cn = {
    host: 'isilo.db.elephantsql.com',
    port: 5431,
    database: 'henkcnja',
    user: 'henkcnja',
    password: 'kBFPOu0Z3x2cGZIZx_XTEB2vTc-fTJRA'
};

app.use(express.static('public'))
app.use('/js',express.static('js'))
app.engine('mustache',mustacheExpress())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(paginate.middleware(10, 50));
app.set('views','./views')
app.set('view engine','mustache')

app.get('/',(req,res) => {
  res.render('index')
})
app.get('/login',(req,res) => {
  res.render('login')
})
app.get('/register',(req,res) => {
  res.render('register')
})
app.get('/collection',(req,res) => {
  res.render('collections')
})
app.get('/wish-list',(req,res) => {
  res.render('cards')
})
app.get('/profile',(req,res) => {
  res.render('profile')
})

app.get('/search-cards',(req,res) => {
  res.render('search-cards')
})

app.get('/cards',(req,res) => {
  // models.Collection.findAll().then((cards) => {
  //   res.render('cards', {cards: cards})
  // })
    res.render('cards')
})

app.get('/view-card/', (req,res,next) => {
  let searchTerm = req.query.search

  mtg.card.where({
    name: `${searchTerm}`
  })
  .then(cards => {
    res.status(200).json({'cards': cards})
  }).catch(err => next(err))
})

app.post('/add-collection',(req,res) => {
  let card = {
    multiverseid: req.body.multiverseid,
    user: currentUser
  }

  models.Collection.create(card).then(function() {
    res.status(200).send()
  })
})

app.post('/add-wishlist',(req,res) => {
  let card = {
    multiverseid: req.body.multiverseid,
    user: currentUser
  }

  models.Wishlist.create(card).then(function() {
    res.status(200).send()
  })
})


app.listen(3000,function(){
    console.log("server running")
  })
