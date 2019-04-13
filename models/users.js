'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    location: DataTypes.STRING,
    favedeck: DataTypes.STRING,
    playstyle: DataTypes.STRING,
    playtime: DataTypes.STRING,
    profileimg: DataTypes.STRING,
    numberofcards: DataTypes.INTEGER,
    aboutme: DataTypes.STRING
  }, {});
  Users.associate = function(models) {
    // associations can be defined here
  };
  return Users;
};
