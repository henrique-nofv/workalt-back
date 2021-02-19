import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Event, { StatusEvent, EventType } from 'App/Models/Event'
import EventStudent from 'App/Models/EventStudent'
import Student from 'App/Models/Student'
import EventStudentValidator from 'App/Validators/EventStudentValidator'
import CreateEventStudentService from 'App/services/CreateEventStudentService'

export default class EventStudentsController {
  /**
   * Cria incrição de um aluno em um evento
   * @param student_id
   * @param event_id
   */
  public async store({ request, response }: HttpContextContract) {
    const body = await request.validate(EventStudentValidator)

    const createEventStudentService = new CreateEventStudentService()

    const event = await createEventStudentService.execute(body)

    let status = StatusEvent.PENDING

    if (event.type === EventType.GROUP) {

      let countStudents = event.students.length

      if (event.max_students > countStudents) status = StatusEvent.OPEN

    }

    event.merge({
      status
    })

    await event.save()

    return response.status(200).json(event)
  }

  //buscar cartãoes do personal por segurança
  public async index({ response }: HttpContextContract) {
    const studentEvents = await EventStudent.query().preload('event', query => query.preload('students'))

    return response.status(200).json(studentEvents)
  }

  public async StudentEvents({ params, response }: HttpContextContract) {
    if (!params.id) {
      response.status(422).json({ message: 'id vazio' })
    }

    let studentEvents

    try {
      studentEvents = await EventStudent.query().
        preload('event', (query) =>
          query.preload('addresses')
            .preload('categories')
            .preload('students', query => query.preload('user'))
            .preload('personal_trainer', query =>
              query.preload('user').preload('ratings')
            ))
        .where({ student_id: params.id })
    } catch (error) {
      return response.status(500).json({
        message: 'Erro ao buscar eventos do estudante.',
        error,
      })
    }

    if (!studentEvents.length) {
      return response.status(422).json({ message: 'Não possui eventos para este estudante.' })
    }
    let events: any[] = []

    await Promise.all(studentEvents.map((eventStudent) => {
      const { event, id } = eventStudent
      const { personal_trainer, ...rest } = event.$preloaded
      const { $preloaded: { ratings, user }, $attributes: rest_personal } = personal_trainer
      const filteredRating = ratings.filter(rating =>
        rating.student_event_id === id)

      if (filteredRating.length == 0) {
        events.push({
          event_student_id: id,
          ...event.$attributes,
          ...rest,
          personal_trainer: {
            ...rest_personal,
            ratings: filteredRating,
            user
          }
        })
      }
    })
    )

    return response.status(200).json(events)
  }

  public async show({ params, response }: HttpContextContract) {
    if (!params.id) {
      response.status(422).json({ message: 'id vazio' })
    }

    const studentEvents = await EventStudent.query()
      .preload('event', query => {
        query.preload('students')
          .where({ id: params.id })
          .first()
      })


    if (!studentEvents) {
      return response.status(422).json({ message: 'Não tem dados' })
    }

    return response.status(200).json(studentEvents)
  }

  public async removeStudentEvent({ response, params }: HttpContextContract) {
    const event = await Event.findOrFail(params.event_id)

    if (!event) {
      throw new Error('Evento não encontrado')
    }

    const student = await Student.findOrFail(params.student_id)

    if (!student) {
      throw new Error('Aluno não encontrado')
    }

    //Cria o relacionamento entre o evento e o aluno
    event?.related('students').detach([student.id])

    return response.status(200).json(student)
  }

  public async isPresentStudentInEvent({
    request,
    response,
    params,
  }: HttpContextContract) {
    const { is_present } = request.post()
    const eventStudent = await EventStudent.query()
      .where({ event_id: params.event_id, student_id: params.student_id })
      .first()

    if (!eventStudent) {
      throw new Error('Evento não encontrado')
    }

    eventStudent.merge({ is_present })

    await eventStudent.save()

    return response.status(200).json(eventStudent)
  }
}
