import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Payments extends BaseSchema {
  protected tableName = 'payments'

  public async up () {
    await this.db.rawQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').exec()
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').unique().primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)

      table.uuid('credit_card_id').references('id').inTable('credit_cards').onUpdate('CASCADE')
      table.enum('type', ['INPUT','OUTPUT']).notNullable()
      table.float('payment_value').notNullable()
      table.string('payment_type').notNullable()
      table.dateTime('paid_at')

      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
