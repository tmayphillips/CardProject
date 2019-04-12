'use strict';
module.exports = (sequelize, DataTypes) => {
 const Collection = sequelize.define('Collection', {
   multiverseid: DataTypes.INTEGER,
   userId: DataTypes.INTEGER
 }, {});
 Collection.associate = function(models) {
   // associations can be defined here
 };
 return Collection;
};
