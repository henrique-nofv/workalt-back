import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Event from './Event'
import Student from './Student'

export default class EventStudent extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public event_id: string

  @column()
  public student_id: string

  @column()
  public is_present: boolean

  @belongsTo(() => Event, { foreignKey: 'event_id'})
  public event: BelongsTo<typeof Event>

  @belongsTo(() => Student, { foreignKey: 'student_id'})
  public student: BelongsTo<typeof Student>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
