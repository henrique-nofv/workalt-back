import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
// import Event from './Event'

export default class Geolocation extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public event_id: string

  @column()
  public lat: number

  @column()
  public long: number

  // @belongsTo(() => Event, { foreignKey: 'event_id'})
  // public event: BelongsTo<typeof Event>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
