import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EventCategories extends BaseSchema {
  protected tableName = 'event_categories'

  public async up () {
    await this.db.rawQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').exec()
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').unique().primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)

      table.uuid('category_id').references('id').inTable('categories').onUpdate('CASCADE')
      table.uuid('event_id').references('id').inTable('events').onUpdate('CASCADE').onDelete('CASCADE')

      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
