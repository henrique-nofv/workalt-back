import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MaxStudents extends BaseSchema {
  protected tableName = 'events'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('max_students')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('max_students')
    })
  }
}
