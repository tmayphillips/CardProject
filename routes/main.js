var router = require('express').Router()
var faker = require('faker')
var Card = require('../models/card')

router.get('/cards/:page', function(req, res, next) {
    var perPage = 9
    var page = req.params.page || 1

    Card
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, products) {
            Card.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('main/cards', {
                    cards: cards,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
})
