var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CardSchema = new Schema({
    multiverseid: Number
})

module.exports = mongoose.model('Card', CardSchema)

//
// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const Card = sequelize.define('Card', {
//     multiverseid: DataTypes.INTEGER
//   }, {});
//   Card.associate = function(models) {
//     // associations can be defined here
//   };
//   return Card;
// };
