const Sequelize = require('sequelize')
const db = require('../db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const axios = require('axios');

const SALT_ROUNDS = 5;

const User = db.define('user', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
  },
  creative: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: "3",
    validate: {
      notEmpty: true,
      min: 0,
      max: 5,
    },
  },
  athletic: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: "3",
    validate: {
      notEmpty: true,
      min: 0,
      max: 5,
    },
  },
  relaxing: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: "3",
    validate: {
      notEmpty: true,
      min: 0,
      max: 5,
    },
  },
  adventurous: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: "3",
    validate: {
      notEmpty: true,
      min: 0,
      max: 5,
    },
  },
  social: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: "3",
    validate: {
      notEmpty: true,
      min: 0,
      max: 5,
    },
  },
  imageUrl: {
    type: Sequelize.STRING,
    defaultValue: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
  },
})

module.exports = User

/**
 * instanceMethods
 */
User.prototype.correctPassword = function(candidatePwd) {
  //we need to compare the plain version to an encrypted version of the password
  return bcrypt.compare(candidatePwd, this.password);
}

User.prototype.generateToken = function() {
  return jwt.sign({id: this.id}, process.env.JWT)
}

/**
 * classMethods
 */
User.authenticate = async function({ username, password }){
    const user = await this.findOne({where: { username }})
    if (!user || !(await user.correctPassword(password))) {
      const error = Error('Incorrect username/password');
      error.status = 401;
      throw error;
    }
    return user.generateToken();
};

User.findByToken = async function(token) {
  try {
    const {id} = await jwt.verify(token, process.env.JWT)
    const user = User.findByPk(id,
      {attributes:{
        exclude: ['password']
      }
    })
    if (!user) {
      throw 'nooo'
    }
    return user
  } catch (ex) {
    const error = Error('bad token')
    error.status = 401
    throw error
  }
}

/**
 * hooks
 */
const hashPassword = async(user) => {
  //in case the password has been changed, we want to encrypt it with bcrypt
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
  }
}

User.beforeCreate(hashPassword)
User.beforeUpdate(hashPassword)
User.beforeBulkCreate(users => Promise.all(users.map(hashPassword)))
