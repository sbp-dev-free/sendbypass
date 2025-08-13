export interface LanguagesResponse {
  count: number;
  next: string;
  previous: string;
  results: Language[];
}

export interface Language {
  name: string;
  iso: string;
}
