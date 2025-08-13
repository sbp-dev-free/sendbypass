export interface EmailResponse {
  email: string;
  referred?: string;
}

export interface StoreEmailRequest {
  email: string;
  referred?: string;
}

export interface StoreEmailResponse {
  error: string;
}
