import CreditCard from 'App/Models/CreditCard'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import CreditCardValidator from 'App/Validators/CreditCardValidator'
import PersonalTrainer from 'App/Models/PersonalTrainer'

export default class CreditCardsController {
  public async store ({ request, response, auth }: HttpContextContract) {
    const body = await request.validate(CreditCardValidator)

    if (auth.user?.id) {
      const personal = await PersonalTrainer.findBy('user_id', auth.user.id)
      if (!personal) {
        throw new Error('Não exite Personal Trainer')
      }
      const cardCredit = await CreditCard.firstOrCreate({
        ...body,
        personal_trainer_id: personal.id,
      })

      delete cardCredit.$attributes.card_hash

      return response.status(200).json(cardCredit)
    }

    return response.status(400).json('Deu ruim')
  }

  //buscar cartãoes do personal
  public async index ({ response, auth }: HttpContextContract) {
    const user_id: string | undefined = auth.user?.id
    if(!user_id){
      throw new Error('')
    }
    const personalTrainer = await PersonalTrainer.findBy('user_id', user_id)

    if (!personalTrainer) {
      throw new Error('Não exite Personal Trainer')
    }

    const creditCards = await CreditCard.query().where({ personal_trainer_id: personalTrainer?.id })

    return response.status(200).json(creditCards)
  }

  public async show ({ params, response }: HttpContextContract) {
    if (!params.id) {
      response.status(422).json({ message: 'falta de dados' })
    }

    const creditCard = await CreditCard.query().where({ id: params.id }).first()

    if (!creditCard) {
      return response.status(204).json({ message: 'não exite cartões' })
    }

    return response.status(200).json(creditCard)
  }

  public async destroy ({ response, params }: HttpContextContract) {
    const id = params.id
    const creditCard = await CreditCard.findOrFail(id)

    if (!creditCard) {
      throw new Error(`o creditCard: ${creditCard} deletada com sucesso.`)
    }

    await creditCard.delete()

    return response.status(200).json(creditCard)
  }
}
