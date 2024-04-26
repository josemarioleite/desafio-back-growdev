'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('students', [
      { name: 'João', email: 'joao@example.com', cpf: '123.456.789-01', createdAt: new Date(), updatedAt: new Date() }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('students', null, {})
  }
}
