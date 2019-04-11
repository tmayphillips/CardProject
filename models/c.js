'use strict';
module.exports = (sequelize, DataTypes) => {
  const c = sequelize.define('c', {
    multiverseid: DataTypes.INTEGER
  }, {});
  c.associate = function(models) {
    // associations can be defined here
  };
  return c;
};