import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Event from './Event'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public cep: string

  @column()
  public street: string

  @column()
  public number: string

  @column()
  public complement: string

  @column()
  public district: string

  @column()
  public city: string

  @column()
  public uf: string

  //RELATIONS
  @hasMany(()=> Event, {foreignKey: 'address_id'})
  public events: HasMany<typeof Event>
  //RELATIONS

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
