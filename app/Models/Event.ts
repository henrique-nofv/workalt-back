import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Address from './Address'
import Category from './Category'
import Geolocation from './Geolocation'
import PersonalTrainer from './PersonalTrainer'
import Student from './Student'

export enum StatusEvent {
  OPEN = 'OPEN',
  PENDING = 'PENDING',
  CLOSE = 'CLOSE'
}

export enum EventType {
  INDIVIDUAL='INDIVIDUAL',
  GROUP='GROUP'
}

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public personal_trainer_id: string

  @column()
  public max_students: number

  @column()
  public address_id: string

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public price: number

  @column()
  public duration: number

  @column()
  public status: StatusEvent

  @column()
  public is_online: boolean

  @column()
  public url: string

  @column()
  public type: EventType

  @column()
  public date: DateTime

  // RELATIONS
  @manyToMany(() => Student, { pivotTable: 'event_students' })
  public students: ManyToMany<typeof Student>

  @manyToMany(() => Category, { pivotTable: 'event_categories' })
  public categories: ManyToMany<typeof Category>

  @belongsTo(() => Address, { foreignKey: 'address_id'})
  public addresses: BelongsTo<typeof Address>

  @belongsTo(() => PersonalTrainer, { foreignKey: 'personal_trainer_id'})
  public personal_trainer: BelongsTo<typeof PersonalTrainer>

  @hasOne(() => Geolocation, { foreignKey: 'event_id'})
  public geolocation: HasOne<typeof Geolocation>

  // RELATIONS

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
