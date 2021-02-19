import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Events extends BaseSchema {
  protected tableName = 'events'

  public async up () {
    await this.db.rawQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').exec()
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').unique().primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)

      table.uuid('personal_trainer_id').notNullable().references('id').inTable('personal_trainers').onUpdate('CASCADE')
      table.uuid('address_id').notNullable().references('id').inTable('addresses').onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.string('title').notNullable()
      table.string('description').notNullable()
      table.float('price').notNullable()
      table.integer('duration')
      table.enum('status', ['OPEN', 'PENDING', 'CLOSE']).defaultTo('OPEN')
      table.dateTime('date').notNullable()

      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
