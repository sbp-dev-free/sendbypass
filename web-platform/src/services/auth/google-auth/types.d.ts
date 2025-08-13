export interface GoogleAuthRequest {
  state: string;
  code: string;
  error?: string;
}

export interface GoogleAuthResponse {
  token: {
    access: string;
    refresh: string;
  };
  status?: number;
}
