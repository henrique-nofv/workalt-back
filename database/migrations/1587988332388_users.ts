import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    await this.db.rawQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').exec()
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').unique().primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)

      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('cellphone_number').notNullable()
      table.string('remember_me_token').nullable()
      table.date('birth_date').notNullable()
      table.enum('status', ['ACTIVE','PENDING', 'BLOCKEAD']).defaultTo('ACTIVE')

      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
