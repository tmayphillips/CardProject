const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const models = require('./models')
const mtg = require('mtgsdk')
const sequelize = require('sequelize')
const session = require('express-session')
const bcrypt = require('bcrypt')
let currentUser = {}

app.use(session( {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use(express.static('public'))
app.use('/js',express.static('js'))
app.engine('mustache',mustacheExpress())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('views','./views')
app.set('view engine','mustache')

const VIEWS_PATH = path.join(__dirname, '/views')
app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))

// route from register page - adding user to database
app.post('/add-user',(req,res) => {
  let username = req.body.userName
  let location = req.body.location
  let favedeck = req.body.faveDeck
  let playstyle = req.body.playStyle
  let playtime = req.body.playTime
  let aboutme = req.body.aboutme
  let numberofcards = req.body.numberOfCards
  let profileimg = req.body.avatar
  let email = req.body.email
  let password = req.body.password

// encrypting password and contains user object with all the data
  bcrypt.hash(password, 10, function(err, hash) {
    let user = {
      username : username,
      location : location,
      favedeck : favedeck,
      playstyle : playstyle,
      playtime : playtime,
      profileimg : profileimg,
      aboutme : aboutme,
      numberofcards : numberofcards,
      email : email,
      password : hash
    }
    models.Users.create(user).then(user => {
      res.render('login')
      console.log(user)
    })
  })
})

// route from login page to login in the user and start new session
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
      console.log("user does not exist")
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

// route to get to edit profile page
app.post('/edit-profile',(req,res) => {
  models.Users.findOne({
    where: {
      username: req.session.username.username
    }
  })
  res.redirect('/edit-profile')
})
// route to edit the profile
app.get('/edit-profile',(req,res) => {
  models.Users.findOne({
    where: {
      username: req.session.username.username
    }
  }).then(function(user) {
    console.log(user.dataValues)
    res.render('edit-profile', {user: user.dataValues})
  })
})
// route to update profile
app.post('/update-profile',(req,res) => {
  models.Users.findOne({
    where: {
      username: req.session.username.username
    }
  }).then(function(user) {
    user.update({
      location: req.body.location,
      favedeck: req.body.faveDeck,
      playstyle: req.body.playStyle,
      playtime: req.body.playTime,
      numberofcards: req.body.numberOfCards,
      aboutme: req.body.aboutme
    })
    res.render('profile', {user: user})
  })
})
//route to view collection
app.get('/collection',(req,res) => {
  models.Users.findOne({
    where: {
      username: req.session.username.username
    }
  }).then(function(user) {
    res.render('collection', {user: user})
  })
})
//route to view wish list
app.get('/wish-list',(req,res) => {
  models.Users.findOne({
    where: {
      username: req.session.username.username
    }
  }).then(function(user) {
    res.render('wish-list', {user: user})
  })
})
// route to profile page populated with the current session data
  app.get('/profile',(req,res) => {
    models.Users.findOne({
      where: {
        username: req.session.username.username
      }}).then(function(user) {
        res.render('profile', {user: user})
      })
  })

// various routes ready to use
app.get('/',(req,res) => {
  res.render('index')
})
app.get('/login',(req,res) => {
  res.render('login')
})
app.get('/register',(req,res) => {
  res.render('register')
})

app.get('/search-cards',(req,res) => {
    console.log(req.session)
    models.Users.findOne({
        where: {
            username: req.session.username.username,
        }
    }).then(user => {
    res.render('search-cards', {user: user})
    })
})

app.get('/view-card/', (req,res,next) => {
  let searchTerm = req.query.search

  mtg.card.where({
    name: `${searchTerm}`
  })
  .then(cards => {
    res.status(200).json({'cards': cards, 'userId': req.session.username.id})
  }).catch(err => next(err))
})

//***********ADD CARD TO COLLECTION***********//
app.post('/add-collection',(req,res) => {
    //Get the input variables from the search page
    let multiverseid = req.body.multiverseid
    let userId = req.body.userId
    //create variable that holds an object made of multiverseid and userId, in format of Collection class
    let collection = models.Collection.build({
        multiverseid: multiverseid,
        userId: userId
      })
    //save the new variable to the collection table
    collection.save().then((savedCard) => {
      console.log(savedCard)
    })
    .then(() => {
      //success message
      console.log("Ay pretty good")
    }).catch(error => console.log(error))
})

//***********DISPLAY CARDS IN USER'S COLLECTION***********//

app.get('/view-collection',(req,res) => {
  let promises = []
  models.Collection.findAll({
    where: {
      userId: req.session.username.id
    }
  }).then(cardCollection => {
    cardCollection.forEach((col) => {
      let promise = mtg.card.where({
        multiverseid: col.dataValues.multiverseid
      })
      promises.push(promise)
    })
    Promise.all(promises)
    .then(result => {
    res.status(200).json({'cards': result, 'userId': req.session.username.id})
})
})
})

app.get('/view-wishlist',(req,res) => {
  let promises = []
  models.Wishlist.findAll({
    where: {
      userId: req.session.username.id
    }
  }).then(cardWishlist => {
    cardWishlist.forEach((col) => {
      let promise = mtg.card.where({
        multiverseid: col.dataValues.multiverseid
      })
      promises.push(promise)
    })
    Promise.all(promises)
    .then(result => {
    res.status(200).json({'cards': result, 'userId': req.session.username.id})
})
})
})


//***********VIEW SEARCH RESULTS***********//
app.post('/view-card-name',(req,res) => {
    //Search by card name
    let cardName = req.body.cardName
    //Use mtg's api interface to match cardName to database
    mtg.card.where({ name: `${cardName}`})
    //create promise holding 'cards', whose value is what was returned by mtg.card.where
    .then(cards => {
      //render view-card page with cards in 'cards', and the session user id in userid
      res.render('view-card',{cards: cards, userid: req.session.username.id})
    })
})

app.post('/view-card-advanced',(req,res) => {
  //Search by card name
  let cardName = req.body.cardName
  let cardColor = req.body.cardColor
  let cardSupertype = req.body.cardSupertype
  let cardCMC = req.body.cardCMC
  let cardRarity = req.body.cardRarity
  let cardArtist = req.body.cardArtist
  let cardId = req.body.cardId
  let cardSubtype = req.body.Subtype
  //Use mtg's api interface to match cardName to database
  mtg.card.where({ name: `${cardName}`, supertypes: `${cardSupertype}`, colors: `${cardColor}`, cmc: `${cardCMC}`, rarity: `${cardRarity}`, artist: `${cardArtist}`, multiverseid: `${cardId}`})
  //create promise holding 'cards', whose value is what was returned by mtg.card.where
  .then(cards => {
    //render view-card page with cards in 'cards', and the session user id in userid
    res.render('view-card',{cards: cards, userid: req.session.username.id})
  })
})

app.listen(3000,function(){
    console.log("server running")
  })
