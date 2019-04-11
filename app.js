const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const models = require('./models')
const mtg = require('mtgsdk')
var session = require('express-session')
const bcrypt = require('bcrypt')
const VIEWS_PATH = path.join(__dirname, '/views')

app.use(session( {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(express.static('public'))
app.engine('mustache',mustacheExpress())
app.use(bodyParser.urlencoded({ extended: false }))
app.set('views','./views')
app.set('view engine','mustache')
app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))



//***********REGISTER USER***********//
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

//***********LOGIN USER***********//
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


//***********GET PAGE RENDERS***********//

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

app.get('/view-card',(req,res) => {
  console.log(req.session)
  models.Users.findOne({
      where: {
          username: req.session.username.username,
      }
  }).then(user => {
  res.render('view-card', {user: user})
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

app.get('/wish-list',(req,res) => {
  res.render('wish-list')
})

app.get('/profile',(req,res) => {
  res.render('profile')
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
  //Get objects from table that match the user's ID to Collection FK
  models.Collection.findAll({
    where: {
      userId: req.session.username.id
    }
  //Create json out of the resulting objects
  }).then(result => {
    res.status(200).json({'cards': result})
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

    // **A BUNCH OF DIFFERENT SEARCH TYPES WE MAY USE IN THE FUTURE: **

    // mtg.card.all({ name: 'Squee', pageSize: 1 })
    // .on('data', card => {
    //     console.log(card)
    // // res.render('view-card',{card: card})
    // console.log(card.name)
    // })

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
//multiverseid: `${cardId}`, subtypes: `${cardSubtype}`
//***********ZOMBIE CODE***********//
// app.get('/collection',(req,res) => {
//     console.log(req.session)
//     models.Users.findOne({
//         where: {
//             username: req.session.username.username,
//         }
//     }).then(user => {
//     res.render('collection', {user: user})
//     })
// })

//     console.log(result)
//     mtg.card.find(result[0].dataValues.multiverseid)
//   }).then(cards => {
//     console.log(cards)
//     res.render('collection',{cards: cards, user: req.session.username})


//***********FIRE SERVER***********//
app.listen(3000,function(){
    console.log("Server sure is humming!")
})