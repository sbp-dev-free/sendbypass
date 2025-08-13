export interface AddressesPatchBody {
  add: {
    country: string;
    city: string;
    description: string;
  }[];
  update: {
    id: string;
    country: string;
    city: string;
    description: string;
  }[];
  delete: {
    id: string;
  }[];
}
