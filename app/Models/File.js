'use strict'

const Model = use('Model')
const Env = use('Env')

class File extends Model {
  static get computed () {
    return ['url']
  }

  getUrl ({ id }) {
    const appUrl = Env.get('APP_URL')
    return `${appUrl}/files/${id}`
  }
}

module.exports = File
