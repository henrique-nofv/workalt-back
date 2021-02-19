import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Payment from './Payment'

export default class CreditCard extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public personal_trainer_id: string

  @column()
  public card_hash: string

  @column()
  public nickname: string

  // RELATIONS
  @hasMany(() => Payment)
  public payments: HasMany<typeof Payment>
  // RELATIONS

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
