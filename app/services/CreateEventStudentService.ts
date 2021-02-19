import Event from 'App/Models/Event'
import Student from 'App/Models/Student'

interface Request{
  student_id: string;
  event_id: string;
}

export default class CreateEventStudentService {
  /**
   * name
   */
  public async execute (request: Request): Promise<Event>{
    const event = await Event.findOrFail(request.event_id)

    if (!event) {
      throw new Error('Evento não encontrado')
    }

    const student = await Student.findOrFail(request.student_id)

    if (!student) {
      throw new Error('Aluno não encontrado')
    }

    //Cria o relacionamento entre o evento e o aluno
    await event?.related('students').attach([student.id])

    await event.preload('students', (query) => query.preload('user'))

    return event
  }
}
