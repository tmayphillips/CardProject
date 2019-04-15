'use strict';
module.exports = (sequelize, DataTypes) => {
 const Wishlist = sequelize.define('Wishlist', {
   multiverseid: DataTypes.INTEGER,
   userId: DataTypes.INTEGER
 }, {});
 Wishlist.associate = function(models) {
   // associations can be defined here
 };
 return Wishlist;
};
