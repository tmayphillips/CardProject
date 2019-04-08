const express = require('express')
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const app = express()
const path = require('path')

app.use(bodyParser.urlencoded({ extended: false }))
app.engine('mustache', mustacheExpress())
app.use(express.static('public'))
app.set('views','./views')
app.set('view engine','mustache')


const VIEWS_PATH = path.join(__dirname, '/views')

app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))

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
  res.render('collection')
})
app.get('/wish-list',(req,res) => {
  res.render('wish-list')
})
app.get('/profile',(req,res) => {
  res.render('profile')
})







app.listen(3000,() => {
  console.log('server is a go')
})
