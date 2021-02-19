import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'
import UserRole from './UserRole'
import Student from './Student'
import PersonalTrainer from './PersonalTrainer'

export enum Status {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  BLOCKEAD = 'BLOCKEAD',
}

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public cellphone_number: string

  @column()
  public name: string

  @column()
  public avatar: string

  @column()
  public rememberMeToken?: string

  @column()
  public birth_date: DateTime

  @column()
  public status: Status

  @hasOne(() => Student, { foreignKey: 'user_id' })
  public student: HasOne<typeof Student>

  @hasOne(() => PersonalTrainer, { foreignKey: 'user_id' })
  public personal: HasOne<typeof PersonalTrainer>

  //RELATIONS
  @hasMany(() => UserRole, { foreignKey: 'user_id' })
  public roles: HasMany<typeof UserRole>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
