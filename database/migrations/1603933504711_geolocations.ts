import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Geolocations extends BaseSchema {
  protected tableName = 'geolocations'

  public async up () {
    await this.db.rawQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').exec()
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').unique().primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)
      table.uuid('event_id').notNullable().references('id').inTable('events').onUpdate('CASCADE')
      table.float('lat')
      table.float('long')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
