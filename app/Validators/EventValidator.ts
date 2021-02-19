import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { EventType, StatusEvent } from 'App/Models/Event'

export default class EventValidator {
  constructor (private ctx: HttpContextContract) {}

  /**
   * Defining a schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    title: schema.string(),
    description: schema.string(),
    price: schema.number(),
    duration: schema.number(),
    status: schema.enum(Object.values(StatusEvent)),
    date: schema.date(),
    max_students: schema.number(),
    is_online: schema.boolean.optional(),
    url: schema.string.optional(),
    type: schema.enum(Object.values(EventType)),
    personal_trainer_id: schema.string.optional({}, [
      rules.exists({ column: 'id', table: 'personal_trainers' }),
    ]),
    categories_ids: schema.array().members(
      schema.string({}, [
        rules.exists({column: 'id', table: 'categories' }),
      ])
    ),
    address: schema.object().members({
      cep: schema.string(),
      street: schema.string(),
      number: schema.string(),
      complement: schema.string.optional(),
      district: schema.string(),
      city: schema.string(),
      uf: schema.string(),
    }),

  })

  /**
   * The `schema` first gets compiled to a reusable function and then that compiled
   * function validates the data at runtime.
   *
   * Since, compiling the schema is an expensive operation, you must always cache it by
   * defining a unique cache key. The simplest way is to use the current request route
   * key, which is a combination of the route pattern and HTTP method.
   */
  public cacheKey = this.ctx.routeKey

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   */
  public messages = {}
}
