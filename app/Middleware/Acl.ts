import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'

export default class Acl {
  public async handle (
    { auth }: HttpContextContract,
    next: () => Promise<void>,
    allowedRoles: string[],
  ) {
    const user = await auth.authenticate()
    await user.preload('roles')
    const userRoles = user.roles.map((role)=> role.role)

    const hasAcces = allowedRoles.map((role):boolean => {
      if(userRoles.includes(role)){
        return true
      }
      return false
    })

    if(!hasAcces.includes(true)){
      throw new AuthenticationException(
        'Unauthorized access',
        'E_UNAUTHORIZED_ACCESS',
      )
    }

    await next()
  }
}
