'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User,
        {
          foreignKey:
            'ownerId'
        }
      )

      Spot.hasMany(models.Review,
        {
          primaryKey: 'id',
          foreignKey: 'spotId',
          onDelete: 'CASCADE',
          hooks: true,
          as: 'avgRating'
        }
      )
      Spot.hasMany(models.SpotImage,
        {
          primaryKey: 'id',
          foreignKey: 'spotId',
          as: 'previewImage',
          onDelete: 'CASCADE',
          hooks: true
        }
      )
      Spot.hasMany(models.Booking,
        {
          foreignKey: 'spotId',
          onDelete: 'CASCADE',
          hooks: true
        })
    }
  }
  Spot.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: true,
        min: -90,
        max: 90
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: true,
        min: -180,
        max: 180
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type:DataTypes.STRING,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
