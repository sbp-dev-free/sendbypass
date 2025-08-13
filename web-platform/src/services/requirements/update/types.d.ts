import type { DeepPartial } from "react-hook-form";

import { RequirementBody } from "../create/types";

export interface RequirementPatchBody extends DeepPartial<RequirementBody> {
  id: string | number;
}
