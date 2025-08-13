import 'next-auth'


declare module 'next-auth' {
  interface Session {
    error?: 'RefreshAccessTokenError'
  }

  interface User {
    access: string;
    refresh: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    access_token: string
    refresh_token: string
    error?: 'RefreshAccessTokenError'
    exp: number
    iat: number
    jti: string
    user_id: number
  }
}
