import Stripe from 'stripe'
import Env from '@ioc:Adonis/Core/Env'
import PersonalTrainer from 'App/Models/PersonalTrainer'
import Payment, { TypePayment } from 'App/Models/Payment'
import Subscription, { StatusSubscription } from 'App/Models/Subscription'
import { DateTime } from 'luxon'
import Plan from 'App/Models/Plan'

export interface Request {
  personal_trainer_id: string;
  plan_id: string;
  token:{
    tokenId: string
  }
}

interface Response{
  status: string;
  message: string;
  payment: {
    id: string;
    createdAt: DateTime;
    updatedAt: DateTime;
    payment_type: string;
    payment_value: number;
    type: TypePayment;
    paid_at: DateTime;
    credit_card_id: string;
  },
}

export default class MakePaymentService {
  private stripe = new Stripe(Env.get('STRIPE_KEY', '') as string, {
    apiVersion: '2020-08-27',
    typescript: true,
  })

  public async execute (request: Request): Promise<Response> {
    //VEIFICA SE JA TEM UMA PAGAMENTO
    const subscription = await Subscription.query()
      .where({ personal_trainer_id: request.personal_trainer_id })
      .preload('payment')
      .first()

    if (subscription?.payment) {
      const msg = subscription.payment.paid_at ? 'autorizado' : 'em análise'
      throw new Error(`Esta assinatura possui um pagamento ${msg}`)
    }

    //BUSCA O PLANO PARA O PERSONAL
    const plan = await Plan.find(request.plan_id)

    if(!plan){
      throw new Error('Não exite plano')
    }

    const valuePayment = Number(plan.value)

    //BUSCA O PERSONAL TRAINER
    const personal = await PersonalTrainer.query()
      .where({ id: request.personal_trainer_id })
      .preload('user', (query) => query.select('email'))
      .first()

    //REALIZA O PAGAMENTO
    const charge = await this.stripe.charges.create({
      amount: Number(valuePayment.toFixed(2).replace('.', '')),
      currency: 'brl',
      source: request.token.tokenId,
      description: 'Assinatura mensal Workalt App',
      receipt_email: personal?.user.email,
    })

    //TODO MUDAR O METHODO DE PAGAMENTO PARA PAYMENT INTENTS
    // const paymentIntents = await this.stripe.paymentIntents.create({
    //   amount: 1099,
    //   currency: 'brl',
    //   payment_method_types: ['card'],
    // })

    //CRIAR NO DB O OBJETO DE PAGAMENTO
    const payment = await Payment.create({
      payment_type: 'creditcard',
      payment_value: valuePayment,
      type: TypePayment.INPUT,
      paid_at: charge.status === 'succeeded' ? DateTime.local() : undefined,
    })

    if(subscription){
      await subscription?.save()
    }else{
      const newSubscription = await Subscription.create({
        payment_id: payment.id,
        personal_trainer_id: request.personal_trainer_id,
        plan_id: plan.id,
        status: StatusSubscription.PAID,
        price: valuePayment,

      })

      await newSubscription.save()
    }

    let message: string
    switch (charge.status) {
      case 'succeeded':
        message = 'Pagamento confirmado com sucesso!.'
        break
      default:
        message = 'O pagamento está sendo processado. Agora é só aguardar'
        break
    }
    return {
      status: charge.status,
      message,
      payment,
    }
  }
}

// const { token } = request.only(['token', 'signatureId'])
// const { userId } = request.auth

// const user = await User.find(userId)

// const signature = await Signature.query()
//   .where({ userId })
//   .preload('coupon')
//   .preload('plan')
//   .preload('payment')
//   .first()

// if (signature.payment) {
//   const msg = !!signature.payment.paidAt ? 'autorizado' : 'em análise'
//   return response.status(400).send({
//     message: `Esta assinatura possui um pagamento ${msg}`,
//   })
// }

// let paymentValue = Number(signature.plan.price)
// if (signature.coupon) {
//   paymentValue = Number(signature.coupon.couponType === 'value'
//     ? paymentValue - signature.coupon.discount
//     : paymentValue - (paymentValue * signature.coupon.discount) / 100)
// }

// try {
//   const charge = await this.stripe.charges.create({
//     amount: Number(paymentValue.toFixed(2).replace('.', '')),
//     currency: 'brl',
//     source: token.tokenId,
//     description: 'Assinatura anual do Medita App',
//     receipt_email: user?.email,
//   })

//   const payment = await Payment.create({
//     paymentType: 'creditcard',
//     paymentValue,
//     signatureId: signature.id,
//     chargeId: charge.id,
//     paidAt: charge.status === 'succeeded' ? DateTime.local() : undefined,
//   })

//   signature.expiresAt = DateTime.local().plus({ year: 1 })
//   signature.save()

//   let message: string
//   switch (charge.status) {
//     case 'succeeded':
//       this.transportService.store({
//         addressId:signature.addressId,
//         userId,
//         giftId: '72b57703-6c08-4baa-b844-82eae698df02',
//         sent:false})

//       message = 'Pagamento confirmado com sucesso!.'
//       break
//     default:
//       this.transportService.store({
//         addressId:signature.addressId,
//         userId,
//         giftId: '72b57703-6c08-4baa-b844-82eae698df02',
//         sent:false})
//       message = 'O pagamento está sendo processado. Agora é só aguardar'
//       break
//   }
//   // recibo
//   // charge.receipt_url
//   return {
//     status: charge.status,
//     message,
//     payment,
//   }
// } catch (error) {
//   return response.status(400).send({ message: `Charge error: ${error.message}`})
// }
