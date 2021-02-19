import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import PersonalTrainer from './PersonalTrainer'

export default class PersonalPhotos extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public personal_trainer_id: string

  @column()
  public url: string

  @belongsTo(() => PersonalTrainer, { foreignKey: 'personal_trainer_id' })
  public personal: BelongsTo<typeof PersonalTrainer>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
