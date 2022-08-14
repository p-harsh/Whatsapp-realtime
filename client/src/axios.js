import axios from 'axios'

const instance = axios.create({
    baseURL: "https://wh4tsapp.herokuapp.com"
})

export default instance;