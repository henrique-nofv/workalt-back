import Env from '@ioc:Adonis/Core/Env'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User, { Status } from 'App/Models/User'
import CreateUserAndRolesService from 'App/services/CreateUserAndRolesServices'
import GoogleStorage from 'App/Util/GoogleStorage'
import UserValidator from 'App/Validators/UserValidator'

export default class AuthController {
  private createUserAndRoleService = new CreateUserAndRolesService()

  public async login ({ request, response, auth }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const userAuth = await auth.use('api').attempt(email, password, {
      expiresIn: Env.get('JWT_EXP') as string || '10 days',
    })

    const token = userAuth.token

    const user = await User.query().where({ id: userAuth.user.id })
      .preload('roles', query => {
        query.select('role')
      }).preload('student').preload('personal', (query) =>
        query.preload('subscription').preload('ratings')
      ).first()

    if(user?.personal){
      if(user.status === Status.PENDING){
        return response.status(401).json({ msg: 'Não foi possivel logar, seu usuario está com pendente de aprovação' })
      }else if(user.status === Status.BLOCKEAD) {
        return response.status(401).json({ msg: 'Não foi possivel logar, seu usuario foi bloqueado' })
      }
    }

    return response.status(200).json({ user, token })
  }

  public async logout ({ response, auth }: HttpContextContract) {
    await auth.use('api').logout()
    return response.status(200).json({ msg: 'logout' })
  }

  public async register ({ request, response }: HttpContextContract) {
    const body = await request.validate(UserValidator)

    const user = await this.createUserAndRoleService.execute(body)

    return response.status(200).json(user)
  }

  public async updateAvatar ({ request, params }: HttpContextContract) {
    const user = await User.find(params.user_id)

    if (!user) {
      throw new Error('Usuario não existe')
    }

    const avatar = request.file('avatar')

    if (!avatar?.tmpPath) {
      throw new Error('Não foi enviado o arquivo')
    }
    let avatarName
    try {
      const googleStorage = new GoogleStorage()
      avatarName = encodeURI(`${Date.now()}${avatar.clientName}`)
      const response = await googleStorage.upload(
        avatar.tmpPath,
        `images/${avatarName}`,
        avatar
      )
      user.merge({ avatar: response })

      await user.save()

      return { response }
    } catch (e) {
      return e
    }
  }

  // public async forgetPassword ({ request, response }: HttpContextContract) {
  //   try {
  //     const {email} = request.post()

  //     const user = await this.authService.requestResetPasswordToken(email)

  //     // await Mail.sendLater((message)=>{
  //     //   message
  //     //     .to(user.email)
  //     //     .subject('Recurepe senha MeditaAPP')
  //     //     .htmlView('emails/forget_password',{
  //     //       user,
  //     //     })
  //     // })

  //     return response.status(200).send({
  //       message: `Uma solicitação de recuperação de senha será enviada ao email ${email} caso ele existir em nossa base.`,
  //     })
  //   } catch (error) {
  //     return response.status(403).send({
  //       message: `Error ao enviar messagem, Error: ${error}.`,
  //     })
  //   }
  // }

  // public async updatePassword ({ request }: HttpContextContract) {
  //   const body = request.only(['token', 'password'])

  //   const response = await this.authService.updatePassword(body)

  //   return response
  // }
}
