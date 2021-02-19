import {
  BaseModel,
  belongsTo,
  BelongsTo, column,
  computed, hasMany,
  HasMany,
  hasOne,
  HasOne
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Address from './Address'
import CreditCard from './CreditCard'
import Event from './Event'
import PersonalPhoto from './PersonalPhoto'
import Rating from './Rating'
import Subscription from './Subscription'
import User from './User'

export default class PersonalTrainer extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public user_id: string

  @column()
  public address_id: string

  @column()
  public cref: string

  @column()
  public describe?: string

  @column()
  public cpf: string

  // RELATIONS
  @belongsTo(() => User, { foreignKey: 'user_id' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Address, { foreignKey: 'address_id' })
  public address: BelongsTo<typeof Address>

  @hasMany(() => Rating, { foreignKey: 'personal_trainer_id' })
  public ratings: HasMany<typeof Rating>

  @hasMany(() => Event, { foreignKey: 'personal_trainer_id' })
  public events: HasMany<typeof Event>

  @hasMany(() => CreditCard, { foreignKey: 'personal_trainer_id' })
  public creditCard: HasMany<typeof CreditCard>

  @hasMany(() => PersonalPhoto, { foreignKey: 'personal_trainer_id' })
  public personalPhotos: HasMany<typeof PersonalPhoto>

  @hasOne(() => Subscription, {
    foreignKey: 'personal_trainer_id',
  })
  public subscription: HasOne<typeof Subscription>

  @computed()
  public get avgRating (): Number {
    if (this.ratings) {
      const ratingsTemp = this.ratings.map((rating) => rating)
      const sum = ratingsTemp.reduce((sum, rating) => sum + rating.rate.valueOf(), 0)
      const count = ratingsTemp.length
      return sum / count
    } else {
      return 0
    }
  }

  @computed()
  public get signatureStatus () {
    if (this.subscription) {
      return 'PAID'
    }
    return 'FREE'
  }
  // RELATIONS

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
