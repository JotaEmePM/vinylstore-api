export interface CreateUserDto {
  name: string
  enabled: boolean
  roles: string[]
  email: UserEmail[]
  password: UserPassword[]
}

interface UserEmail {
  email: string
  hash: string
  confirmed: boolean
  date: Date
}

interface UserPassword {
  password: string
  hash: string
  salt: string
  date: Date
}
