export interface SignInBody {
  email: string;
  password: string;
}

export interface SignInResponse {
  access: string;
  refresh: string;
}
