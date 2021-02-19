import User, { Status } from 'App/Models/User'

import { DateTime } from 'luxon'

type UserRole = {
  user_id: string
  role: string
}

interface Request{
  email:string
  password:string
  remember_me_token?: string
  birth_date?: DateTime
  status: Status
  roles: string[]
}

export default class CreateUserAndRolesService{
  public async execute (request: Request) {
    const userCreate = await User.create(request)

    await userCreate.save()

    const userRoles = request.roles.map((role: string) => {
      const userRole: UserRole = {role, user_id: userCreate.id}
      return userRole
    })

    await userCreate.related('roles').createMany(userRoles)

    return userCreate
  }
}
