import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EventStudents extends BaseSchema {
  protected tableName = 'event_students'

  public async up () {
    await this.db.rawQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').exec()
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').unique().primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)

      table.uuid('student_id').references('id').inTable('students').onUpdate('CASCADE')
      table.uuid('event_id').references('id').inTable('events').onUpdate('CASCADE')
      table.boolean('is_present').defaultTo(false)

      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
