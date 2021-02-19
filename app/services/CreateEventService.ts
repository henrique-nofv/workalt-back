import Address from 'App/Models/Address'
import Event, { StatusEvent } from 'App/Models/Event'
import PersonalTrainer from 'App/Models/PersonalTrainer'
import { DateTime } from 'luxon'
import GeolocationProvider from 'App/Util/GeolocationProvider'

interface Request{
  personal_trainer_id: string | undefined;
  // address_id: string | undefined;
  categories_ids: string[];
  title: string;
  description: string;
  price: number;
  duration: number;
  status: StatusEvent;
  date: DateTime;
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

export default class CreateEventService{
  public async execute ({categories_ids, address , ...rest}: Request, user_id: string): Promise<Event> {
    const personalTrainer = await PersonalTrainer.findBy('user_id', user_id)

    if (!personalTrainer) {
      throw new Error('Personal não exite')
    }

    if(!address){
      throw new Error('Please enviar uma em endereço')
    }

    const addressCreate = await Address.firstOrCreate(address)

    const event = await Event.create({
      ...rest,
      address_id: addressCreate.id,
      personal_trainer_id: personalTrainer?.id,
    })

    await event.save()

    //CRIA A GEOLOCATION DO EVENTO
    const geolocationProvider = new GeolocationProvider()

    //CRIA A GEOLOCAZAÇAO
    await geolocationProvider.GetLocationByAddress(address, event.id)

    //CRIA RELACIONAMENTO DAS CATEGORIAS DO EVENTO
    await event.related('categories').attach(categories_ids)

    await event.preload('categories')
    await event.preload('addresses')

    return event
  }
}
