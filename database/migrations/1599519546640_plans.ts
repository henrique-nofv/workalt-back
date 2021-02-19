import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Plans extends BaseSchema {
  protected tableName = 'plans'

  public async up () {
    await this.db.rawQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').exec()
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').unique().primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)

      table.string('name').notNullable()
      table.float('value').notNullable()

      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
