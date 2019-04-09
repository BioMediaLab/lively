const Model = require('objection').Model

module.exports = class User extends Model {
  static get tableName() {
    return 'users'
  }
}
