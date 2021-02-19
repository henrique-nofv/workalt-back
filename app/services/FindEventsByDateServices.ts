import Event from 'App/Models/Event'

interface Request {
  personal_trainer_id?: string;
  student_id?: string;
  startAt?: Date;
  status?: string,
  endAt?: Date;
}

export default class FindEventsByDateServices {
  /**
   * Busca eventos por entre data e por personal trainer
   * @param request
   * @type Request
   */
  public async execute (request: Request): Promise<Event[]> {
    const query = Event.query()

    if (request.startAt && request.endAt) {
      query.whereBetween('date', [request.startAt, request.endAt])
    }

    if (request.personal_trainer_id) {
      query.where({ personal_trainer_id: request.personal_trainer_id })
    }

    if (request.status) {
      query.where({ status: request.status })
    }

    //TODO: BUSCAR EVENTOS POR RAIO DE DISTANCIA
    // if(body.radius !== 0){
    //   query.where(body.radius)
    // }else{
    //   query.where(body.radius)
    // }

    await query.preload('geolocation')
    await query.preload('addresses')
    await query.preload('students')
    await query.preload('personal_trainer', query => query.preload('user').preload('ratings'))
    await query.preload('categories')

    try {
      const events = await query.exec()
      return events
    } catch (error) {
      throw new Error('Não tem eventos')
    }
  }
}
