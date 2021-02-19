import Address from 'App/Models/Address'
import PersonalTrainer from 'App/Models/PersonalTrainer'
import User from 'App/Models/User'

interface Request{
  address_id?: string
  cref: string
  cpf: string
  address: {
    cep: string
    street: string
    number: string
    complement?: string
    district: string
    city: string
    uf: string
  },
}

export default class CreatePersonalTrainerService{
  public async execute (request: Request, user_id: string) {
    const { address, ...personal} = request
    const user = await User.find(user_id)

    if(!user){
      throw new Error('Usuario não exite')
    }

    const addressDb = await Address.firstOrCreate(address)

    if(!addressDb){
      throw new Error('Endereço não existe ou não foi possivel criar')
    }

    const personalTrainer = await PersonalTrainer.firstOrCreate({...personal,
      user_id: user.id,
      address_id: addressDb.id})

    await personalTrainer.save()

    await personalTrainer.related('user').associate(user)
    await personalTrainer.related('address').associate(addressDb)

    return personalTrainer
  }
}
