import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddFieldDescribePersonals extends BaseSchema {
  protected tableName = 'personal_trainers'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('describe')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('describe')
    })
  }
}
