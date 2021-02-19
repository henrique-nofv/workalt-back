import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddFieldisOnlines extends BaseSchema {
  protected tableName = 'events'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_online')
      table.string('url')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_online')
      table.dropColumn('url')
    })
  }
}
