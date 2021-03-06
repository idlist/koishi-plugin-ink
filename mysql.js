const { Database, Tables } = require('koishi-core')

Database.extend('koishi-plugin-mysql', {
  async loadGameData(subcommand, uid,) {
    let res = await this.query(`SELECT save FROM \`${subcommand}_save\` WHERE uid = ${uid}`)
    if (!res.length) return
    else return JSON.stringify(res[0].save)
  },
  async saveGameData(subcommand, uid, save) {
    return this.query(`INSERT INTO \`${subcommand}_save\` VALUES (${uid}, ${JSON.stringify(save)}) `
      + `ON DUPLICATE KEY UPDATE save = ${JSON.stringify(save)}`)
  }
})

module.exports = subcommand => {
  Database.extend('koishi-plugin-mysql', ({ Domain, tables }) => {
    tables[subcommand + '_save'] = {
      uid: new Domain.String('BIGINT(20) UNSIGNED NOT NULL'),
      save: new Domain.Json()
    }
  })

  Tables.config[subcommand + '_save'] = { primary: 'uid', unique: [] }
}
