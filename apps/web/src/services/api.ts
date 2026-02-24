const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface ApiResponse<T> {
  data?: T
  error?: string
}

interface User {
  id: string
  username: string
  email: string
  createdAt: Date
}

interface LoginResponse {
  user: User
  token: string
}

interface Save {
  id: string
  userId: string
  name: string
  createdAt: Date
  updatedAt: Date
}

class ApiService {
  private token: string | null = null

  constructor() {
    this.token = localStorage.getItem('token')
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }
    return headers
  }

  setToken(token: string | null) {
    this.token = token
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }

  getToken(): string | null {
    return this.token
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: this.getHeaders(),
        body: body ? JSON.stringify(body) : undefined
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Request failed' }
      }

      return { data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' }
    }
  }

  async register(username: string, email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('POST', '/api/auth/register', {
      username,
      email,
      password
    })
    
    if (response.data?.token) {
      this.setToken(response.data.token)
    }
    
    return response
  }

  async login(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('POST', '/api/auth/login', {
      username,
      password
    })
    
    if (response.data?.token) {
      this.setToken(response.data.token)
    }
    
    return response
  }

  logout() {
    this.setToken(null)
  }

  async getSaves(): Promise<ApiResponse<{ saves: Save[] }>> {
    return this.request('GET', '/api/saves')
  }

  async createSave(name: string, gameState: Record<string, unknown>): Promise<ApiResponse<{ save: Save }>> {
    return this.request('POST', '/api/saves', { name, gameState })
  }

  async getSave(id: string): Promise<ApiResponse<{ save: Save & { gameState: Record<string, unknown> } }>> {
    return this.request('GET', `/api/saves/${id}`)
  }

  async getSaveState(id: string): Promise<ApiResponse<{ gameState: Record<string, unknown> }>> {
    return this.request('GET', `/api/saves/${id}/state`)
  }

  async updateSave(id: string, data: { name?: string; gameState?: Record<string, unknown> }): Promise<ApiResponse<{ save: Save }>> {
    return this.request('PUT', `/api/saves/${id}`, data)
  }

  async deleteSave(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/saves/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      })
      return response.ok
    } catch {
      return false
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      return response.ok
    } catch {
      return false
    }
  }

  isAuthenticated(): boolean {
    return !!this.token
  }
}

export const api = new ApiService()
export type { User, Save, LoginResponse, ApiResponse }
