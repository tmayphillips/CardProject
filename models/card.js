'use strict';
module.exports = (sequelize, DataTypes) => {
  const Card = sequelize.define('Card', {
    multiverseid: DataTypes.INTEGER
  }, {});
  Card.associate = function(models) {
    // associations can be defined here
  };
  return Card;
};
