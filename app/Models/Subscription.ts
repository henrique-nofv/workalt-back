import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Payment from './Payment'
import Plan from './Plan'

export enum StatusSubscription {
  PAID = 'PAID',
  PENDING = 'PENDING',
  REFUSED = 'REFUSED'
}

export default class Subscription extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public personal_trainer_id: string

  @column()
  public plan_id: string

  @column()
  public payment_id: string

  @column()
  public price: number

  @column()
  public status: StatusSubscription

  // RELATIONS
  @belongsTo(() => Payment, { foreignKey: 'payment_id' })
  public payment: BelongsTo<typeof Payment>

  @belongsTo(() => Plan, { foreignKey: 'plan_id' })
  public plan: BelongsTo<typeof Plan>
  // RELATIONS

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
