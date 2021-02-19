import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PersonalTrainers extends BaseSchema {
  protected tableName = 'personal_trainers'

  public async up () {
    await this.db.rawQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').exec()
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').unique().primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)

      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
      table.uuid('address_id').references('id').inTable('addresses').onDelete('CASCADE').onDelete('CASCADE')
      table.string('cref').notNullable()
      table.string('cpf').notNullable()

      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
