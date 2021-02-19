import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PersonalTrainer from 'App/Models/PersonalTrainer'
import Subscription from 'App/Models/Subscription'
import MakePaymentService from 'App/services/Payment/MakePaymentSerivce'
import SubscriptionValidator from 'App/Validators/SubscriptionValidator'

export default class SubscriptionsController {
  public async store ({request}: HttpContextContract) {
    const body = await request.validate(SubscriptionValidator)

    const makePayment = new MakePaymentService()

    const payment = await makePayment.execute(body)

    return payment
  }

  public async show ({auth, response}: HttpContextContract) {
    if(!auth?.user){
      throw new Error('Não exite usuario')
    }

    const user_id = auth.user.id

    const personal = await PersonalTrainer.findByOrFail('user_id', user_id)

    const subscription = await Subscription.findByOrFail('personal_trainer_id', personal.id)

    return response.status(200).json(subscription)
  }

  public async renewSubscription ({auth, response}: HttpContextContract) {
    if(!auth?.user){
      throw new Error('Não exite usuario')
    }

    const user_id = auth.user.id

    const personal = await PersonalTrainer.findByOrFail('user_id', user_id)

    const subscription = await Subscription.findByOrFail('personal_trainer_id', personal.id)

    return response.status(200).json(subscription)
  }
}
