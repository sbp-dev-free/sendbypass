import type {
  CreateShippingNeedFormData,
  CreateShoppingNeedFormData,
} from "@/validations/needs";

export interface NeedsFormPreviewProps {
  previewData: CreateShippingNeedFormData | CreateShoppingNeedFormData;
  onClose: () => void;
  type: "SHIPPING" | "SHOPPING";
  needId?: string;
}
