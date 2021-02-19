import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CreditCards extends BaseSchema {
  protected tableName = 'credit_cards'

  public async up () {
    await this.db.rawQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').exec()
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').unique().primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)

      table.uuid('personal_trainer_id').notNullable().references('id').inTable('personal_trainers').onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.string('card_hash').notNullable()
      table.string('nickname')
      table.string('tip')

      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
