import Axios from 'axios'
import Env from '@ioc:Adonis/Core/Env'

const GOOGLE_API_KEY = Env.get('GCS_API_KEY') as string
console.log(GOOGLE_API_KEY)
const api = Axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json',
  params:{
    inputtype: 'textquery',
    fields: 'formatted_address,geometry,name',
    key: GOOGLE_API_KEY,
  },
})

export default api

// https://maps.googleapis.com/maps/api/place/findplacefromtext/json?
// input=82015020&
// inputtype=textquery&
// fields=formatted_address,geometry,name&
// key=
