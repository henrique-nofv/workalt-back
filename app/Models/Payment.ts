import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Subscription from './Subscription'

export enum TypePayment {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public credit_card_id: string

  @column()
  public type: TypePayment

  @column()
  public payment_value: number

  @column()
  public payment_type: string

  @column()
  public paid_at: DateTime

  @hasOne(() => Subscription)
  public subscription: HasOne<typeof Subscription>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
