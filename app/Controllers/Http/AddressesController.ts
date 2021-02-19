import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Address from 'App/Models/Address'
import AddressValidator from 'App/Validators/AddressValidator'

export default class AddressesController {
  public async store ({ request, response }: HttpContextContract) {
    const body = await request.validate(AddressValidator)

    const address = await Address.firstOrCreate(body)

    return response.status(200).json(address)
  }

  public async index ({ response }: HttpContextContract) {
    const plans = await Address.all()

    return response.status(200).json(plans)
  }

  public async show ({ params, response }: HttpContextContract) {
    try {
      const events = await Address.find(params.id)

      return response.status(200).json(events)
    } catch (error) {
      return response.status(422).json({message: 'Não foi encontrado evento com esse id'})
    }
  }

  public async update ({request, response, params}: HttpContextContract) {
    const body = request.post()
    const event = await Address.findOrFail(params.id)

    if (!event.$isPersisted) {
      throw new Error('Addresso não encontrado')
    }

    event.merge(body)

    await event.save()

    return response.status(200).json(event)
  }

  public async destroy ({response, params}: HttpContextContract) {
    const eventId = params.id
    const event = await Address.findOrFail(eventId)

    if (!event) {
      throw new Error(`o aluno: ${event} deletada com sucesso.`)
    }

    await event.delete()

    return response.status(200).json(event)
  }
}

