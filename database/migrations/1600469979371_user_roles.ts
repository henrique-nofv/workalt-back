import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserRoles extends BaseSchema {
  protected tableName = 'user_roles'

  public async up () {
    await this.db.rawQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').exec()
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').unique().primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)

      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
      table.string('role')

      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
