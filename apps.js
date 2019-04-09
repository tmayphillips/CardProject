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
const cn = {
    host: 'isilo.db.elephantsql.com',
    port: 5431,
    database: 'henkcnja',
    user: 'henkcnja',
    password: 'kBFPOu0Z3x2cGZIZx_XTEB2vTc-fTJRA'
};

app.use(express.static('public'))
app.engine('mustache',mustacheExpress())
app.use(bodyParser.urlencoded({ extended: false }))
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
/*
app.get('/cards',(req,res) => {
  res.render('cards')
}) */

app.get('/search-cards',(req,res) => {
  res.render('search-cards')
})

app.get('/cards',(req,res) => {
  models.Collection.findAll().then((cards) => {
    res.render('cards', {cards: cards})
  })
})

// app.post('/view-card',(req,res) => {
//     let cardid = req.body.cardid
//
//     mtg.card.where({ name: `${cardid}`})
//     .then(cards => {
//       console.log(cards);
//         res.render('view-card',{cards: cards})
//     })
// })

app.get('/cards/:page', (req, res) => {
  let limit = 5;   // number of records per page
  let offset = 0;
  models.Collection.findAndCountAll()
  .then((data) => {
    let page = req.params.page;      // page number
    let pages = Math.ceil(data.count / limit);
		offset = limit * (page - 1);
    models.Collection.findAll({
      attributes: ['multiverseid'],
      limit: limit,
      offset: offset,
      $sort: { multiverseid: 1 }
    })
    .then((cards) => {
      res.status(200).json({'result': cards, 'count': data.count, 'pages': pages});
    });
  })
  .catch(function (error) {
		res.status(500).send('Internal Server Error');
	});
});

app.post('/view-card/:page',(req,res) => {
    let cardid = req.body.cardid

    mtg.card.where({ name: `${cardid}`})
    .then((data) => {
      let page = req.params.page;      // page number
      let pages = Math.ceil(data.count / limit);
  		offset = limit * (page - 1);
      mtg.card.where({name: `${cardid}`,
        limit: limit,
        offset: offset
      })
      .then(cards => {
          console.log(cards);
          res.render('view-card/:page',{cards: cards})
      })
    })
    .catch(function (error) {
  		res.status(500).send("AHHH");
  	});
  });




// app.post('/cards',(req,res) => {
//     let cardid = req.body.cardid
//
//     mtg.card.where({ multiverseid: `${cardid}`})
//     .then(cards => {
//       console.log(cards);
//         res.render('view-card',{cards: cards})
//     })
// })

app.get('/view-card',(req,res) => {
    res.render('view-card')
})

app.listen(3000,function(){
    console.log("server running")
  })
