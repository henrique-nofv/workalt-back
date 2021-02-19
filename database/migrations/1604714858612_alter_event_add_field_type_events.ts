import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AlterEventAddFieldTypeEvents extends BaseSchema {
  protected tableName = 'events'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('type', ['INDIVIDUAL', 'GROUP'])
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('type')
    })
  }
}
