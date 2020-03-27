const knex = require('knex')
const configurarion = require('../../knexfile')

const connection = knex(configurarion.development)

module.exports = connection;