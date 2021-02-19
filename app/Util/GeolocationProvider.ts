import Geolocation from 'App/Models/Geolocation'
import api from 'App/services/api'

export interface RequestAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  uf: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Northeast {
  lat: number;
  lng: number;
}

export interface Southwest {
  lat: number;
  lng: number;
}

export interface Viewport {
  northeast: Northeast;
  southwest: Southwest;
}

export interface Geometry {
  location: Location;
  viewport: Viewport;
}

export interface Candidate {
  formatted_address: string;
  geometry: Geometry;
  name: string;
}

export interface GeolocationRequest {
  candidates: Candidate[];
  status: string;
}

export default class GeolocationProvider {
  public async GetLocationByAddress(address: RequestAddress, event_id: string) {
    const addressFormat = { input: `${address.street} ${address.number} ${address.district} ${address.city} ${address.uf}` }

    const response = await api.get<GeolocationRequest>('', {
      params: addressFormat,
    })

    console.log(response)
    if (response.data.candidates.length > 0) {
      const location = response.data.candidates[0].geometry.location

      const geolocation = await Geolocation.create({
        lat: location.lat,
        long: location.lng,
        event_id: event_id,
      })

      await geolocation.save()

      return geolocation
    } else {
      return null
    }
  }
}
