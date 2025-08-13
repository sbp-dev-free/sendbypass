export interface ContactPatchBody {
  add: (
    | {
        type: "PHONE_NUMBER";
        data: { zone_code: { country: string }; phone: string };
      }
    | {
        type: "SOCIAL";
        data: { type: string; link: string };
      }
  )[];
  update: (
    | {
        id: string;
        data: { zone_code?: { country: string }; phone?: string };
      }
    | { id: string; data: { type?: string; link?: string } }
  )[];
  delete: { id: string }[];
}
