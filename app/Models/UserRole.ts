import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export enum Role{
  PERSONAL = 'PERSONAL',
  STUDENT = 'STUDENT'
}

export default class UserRole extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public user_id:string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public role: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
