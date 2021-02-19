import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Subscriptions extends BaseSchema {
  protected tableName = 'subscriptions'

  public async up () {
    await this.db.rawQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').exec()
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').unique().primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)

      table.uuid('personal_trainer_id').notNullable().references('id').inTable('personal_trainers').onUpdate('CASCADE')
      table.uuid('plan_id').notNullable().references('id').inTable('plans').onUpdate('CASCADE')
      table.uuid('payment_id').notNullable().references('id').inTable('payments').onUpdate('CASCADE')
      table.enum('status', ['PAID', 'PENDING', 'REFUSED']).defaultTo('PENDING')
      table.float('price').notNullable()

      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
