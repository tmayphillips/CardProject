const sequelizePaginate = require('sequelize-paginate')

module.exports = (sequelize, DataTypes) => {
  const MyModel = sequelize.define(
    'MyModel',
    {
      name: { type: DataTypes.STRING(255) }
    }
  )
  sequelizePaginate.paginate(MyModel)
  return MyModel
}
