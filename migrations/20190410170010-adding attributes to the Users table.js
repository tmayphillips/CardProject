'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return (
    queryInterface.addColumn('Users', 'location', { 
      type: Sequelize.STRING 
      }),
    queryInterface.addColumn('Users', 'favedeck', { 
      type: Sequelize.STRING 
      }),
    queryInterface.addColumn('Users', 'playstyle', { 
      type: Sequelize.STRING 
      }),
    queryInterface.addColumn('Users', 'playtime', { 
      type: Sequelize.STRING 
      }),
    queryInterface.addColumn('Users', 'profileimg', { 
      type: Sequelize.STRING 
      })
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('location','favedeck','playstyle','playtime','profileimg')
  }
};
