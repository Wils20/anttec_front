import type { loginDTO } from '@/DTOs/auth/LoginDTO'
import type { AxiosInstance } from 'axios'
import axios from 'axios'
import type { loginI } from './interface/LoginInterface'
import { handleApiError } from '@/utils/handleApiError'
import { useAuthStore } from '@/stores/useAuthStore'

const urlApi = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

class AuthService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${urlApi}/auth`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async login(data: loginDTO): Promise<loginI> {
    try {
      const res = await this.api.post('/login', data)
      const token = res.data.token

      const authStore = useAuthStore()
      authStore.setToken(token)
      authStore.setUser(res.data.user)

      return res.data as loginI
    } catch (error) {
      handleApiError(error)
      throw error
    }
  }
}

export default new AuthService()
