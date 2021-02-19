import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import PersonalTrainer from 'App/Models/PersonalTrainer'
import User, { Status } from 'App/Models/User'
import CreatePersonalTrainerService from 'App/services/CreatePersonalService'
import PersonalValidator from 'App/Validators/PersonalValidator'

export default class PersonalTrainersController {
  private createPersonalService = new CreatePersonalTrainerService()

  public async store ({ request, response }: HttpContextContract) {
    const body = await request.validate(PersonalValidator)

    const user_id = body.user_id

    if (!user_id) {
      throw new Error('Vazio')
    }

    const personal = await this.createPersonalService.execute(body, user_id)

    return response.status(200).json(personal)
  }

  public async index ({ request, response }: HttpContextContract) {
    const { status } = request.post()
    const query = PersonalTrainer.query().preload('subscription').preload('user')

    if (Object.values(Status) === status) {
      query.where({ status })
    }

    const personals = await query.exec()

    if (personals.length === 0) {
      return response.status(204).json({ message: 'has no datas' })
    }

    return response.status(200).json(personals)
  }

  public async show ({ params, response }: HttpContextContract) {
    if (!params.id) {
      return response.status(401).json({ message: 'id vazio' })
    }
    let personal
    if(params.id.length == 11){
      personal = await PersonalTrainer.query().where('cpf', params.id)
        .preload('address').preload('user').preload('ratings')
        .first()
    }else{
      personal = await PersonalTrainer.query().where('id', params.id)
        .preload('address').preload('user').preload('ratings')
        .first()
    }

    if (!personal) {
      return response.status(204).json({ message: 'has no datas' })
    }

    return response.status(200).json(personal)
  }

  public async PersonalEvents ({ params, response }: HttpContextContract) {
    if (!params.id) {
      response.status(401).json({ message: 'id vazio' })
    }

    let personalEvents

    personalEvents = await PersonalTrainer.query().where('id', params.id)
      .preload('events',(query)=>
        query.preload('addresses')
          .preload('categories')
          .preload('students', query => query.preload('user'))
          .preload('personal_trainer', query => query.preload('user')))

    if (!personalEvents) {
      return response.status(204).json({ message: 'has no datas' })
    }
    const [events]= personalEvents.map((personal)=> personal.events)
    return response.status(200).json(events)
  }

  public async update ({ request, response, params }: HttpContextContract) {
    const body = request.post()

    const personal = await PersonalTrainer.findOrFail(params.id)

    if (!personal.$isPersisted) {
      throw new Error('Personal not found')
    }

    personal.merge(body)

    await personal.save()

    return response.status(200).json(personal)
  }

  public async destroy ({ response, params }: HttpContextContract) {
    const personalId = params.id
    const personal = await PersonalTrainer.findOrFail(personalId)

    if (!personal) {
      throw new Error(`o personal: ${personal} deletada com sucesso.`)
    }

    await personal.delete()

    return response.status(200).json(personal)
  }

  /**
   * changeStatusPersonal
   */
  public async changeStatusPersonal ({request,response, params}: HttpContextContract) {
    // try {
    const { status } = await request.validate({schema: schema.create({
      status: schema.enum(Object.values(Status)),
    })})

    const personalTrainer = await PersonalTrainer.find(params.id)

    if(!personalTrainer){
      throw new Error('Não existe Personal')
    }

    const user = await User.find(personalTrainer?.user_id)

    if(!user){
      throw new Error('Não existe user')
    }

    user.merge({status})

    await user.save()

    await personalTrainer.preload('user')

    return response.status(200).json(personalTrainer)
    // } catch (error) {
    //   throw new Error(`Não foi possivel altera status do personal trainer, Error: ${error}`)
    // }
  }
}
