export interface TripReducerType {
  visibility: Visibility;
  document: Partial<Document>;
  cargo: Partial<Cargo>;
  shopping: Partial<Document>;
}

export interface Cargo {
  id: number;
  weight: number;
  wage: number;
  length: number;
  width: number;
  height: number;
  description: string;
}

export interface Document {
  id: number;
  weight: number;
  wage: number;
  description: string;
}

export interface Visibility {
  document: boolean;
  cargo: boolean;
  shopping: boolean;
}
