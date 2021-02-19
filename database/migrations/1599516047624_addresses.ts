import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Addresses extends BaseSchema {
  protected tableName = 'addresses'

  public async up () {
    await this.db.rawQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').exec()
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').unique().primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)

      table.string('cep').notNullable()
      table.string('street').notNullable()
      table.string('number').notNullable()
      table.string('complement')
      table.string('district').notNullable()
      table.string('city').notNullable()
      table.string('uf').notNullable()

      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
