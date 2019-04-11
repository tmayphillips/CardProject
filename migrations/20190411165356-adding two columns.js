'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return (
      queryInterface.addColumn('Users', 'numberofcards', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('Users', 'aboutme', {
        type: Sequelize.STRING
      })
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('numberofcards', 'aboutme')
  }
};
