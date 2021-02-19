import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Event from 'App/Models/Event'
import FindEventsByDateServices from 'App/services/FindEventsByDateServices'
import EventValidator from 'App/Validators/EventValidator'
import CreateEventService from 'App/services/CreateEventService'

export default class EventsController {
  /**
   * store
   */
  public async store ({ request, response, auth }: HttpContextContract) {
    const body = await request.validate(EventValidator)
    const user_id = auth.user?.id

    if(!user_id){
      throw new Error('Personal não exite ou não esta logado')
    }

    const createEventServices = new CreateEventService()

    const event = await createEventServices.execute(body, user_id)

    return response.status(200).json(event)
  }

  public async index ({ request, response }: HttpContextContract) {
    const { startAt, endAt, personal_trainer_id, student_id, status } = request.get()
    
    const findEventsByDateService = new FindEventsByDateServices()
    try {
      const events = await findEventsByDateService.execute({ startAt, endAt, personal_trainer_id, student_id, status })

      return response.status(200).json(events)
    } catch (error) {
      return response.status(422).json({message: error.message})
    }
  }

  public async show ({ params, response }: HttpContextContract) {
    try {
      const events = await Event.query().where('id',params.id)
        .preload('students', (query)=> query.preload('user'))
        .preload('personal_trainer', (query)=> query.preload('user'))

      return response.status(200).json(events)
    } catch (error) {
      return response.status(422).json({message: 'Não foi encontrado evento com esse id'})
    }
  }

  public async update ({request,response, params}: HttpContextContract) {
    const body = request.post()
    const event = await Event.findOrFail(params.id)

    if (!event.$isPersisted) {
      throw new Error('Evento não encontrado')
    }

    event.merge(body)

    await event.save()

    return response.status(200).json(event)
  }

  public async destroy ({response, params}: HttpContextContract) {
    const eventId = params.id
    const event = await Event.findOrFail(eventId)

    if (!event) {
      throw new Error(`o aluno: ${event} deletada com sucesso.`)
    }

    await event.delete()

    return response.status(200).json(event)
  }
}
