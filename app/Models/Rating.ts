import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

// TODO: relacionamento entre tabela intermediaria StudentEvent com Rating
export default class Rating extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public personal_trainer_id: string

  @column()
  public student_event_id: string

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public rate: Number

  //RELATIONS

  //RELATIONS

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
