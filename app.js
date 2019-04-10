const express = require('express')
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
var session = require('express-session')
const app = express()
const path = require('path')
const models = require('./models')
const bcrypt = require('bcrypt')


app.use(session( {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.engine('mustache', mustacheExpress())
app.use(express.static('public'))
app.set('views','./views')
app.set('view engine','mustache')


const VIEWS_PATH = path.join(__dirname, '/views')

app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))


app.post('/add-user',(req,res) => {
  let username = req.body.userName
  let email = req.body.email
  let password = req.body.password

  bcrypt.hash(password, 10, function(err, hash) {
    let user = {
      username : username,
      email : email,
      password : hash
    }
    models.Users.create(user).then(user => {
      res.render('login')
      console.log(user)
    })
  })
 
})

app.post('/login', (req,res) => {
  let username = req.body.userName
  let password = req.body.password

  models.Users.findOne({
    where: {
      username: username,
    }
  })
  .then(function(user) {
    if (user == null) {
      console.log("user does not fucking exist")
      res.redirect('/login')
    }
    else {
      bcrypt.compare(password, user.password, function(err, result) {
        if(result) {
          if(req.session) {
            req.session.username = user.dataValues
          }
          res.render('profile', {user: user})
      }
     
    })
  }
})
})










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
