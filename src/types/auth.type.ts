

export interface AuthType {
   email: string,
   name: string,
   password: string,
   confirm_password: string,
   status?: string,
   avatar?: string
}
export type LoginType = Pick<AuthType, 'email' | 'password'>;

export type UpdateType = Pick<AuthType, 'name' | 'avatar' | 'password' >;

export type JwtType = {
   user_id: string,
   iat: number,
   exp: number
}
