export interface User {
  _id: string
  username: string
  email: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserInput {
  username: string
  email: string
  password: string
}

export interface LoginInput {
  username: string
  password: string
}

export interface UserResponse {
  id: string
  username: string
  email: string
  createdAt: Date
}
