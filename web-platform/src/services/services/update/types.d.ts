import { ServiceBody } from "../create/types";

export interface ServicePatchBody extends Partial<ServiceBody> {
  id: string | number;
}
