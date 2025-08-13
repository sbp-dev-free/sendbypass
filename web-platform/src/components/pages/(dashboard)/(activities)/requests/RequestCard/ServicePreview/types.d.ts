import { RequestStatus } from "@/enums/requests";
import { ResultActivity, ResultRequest } from "@/services/types";

export interface ServicePreviewProps {
  type: keyof typeof RequestStatus;
  request: ResultRequest;
  activity: ResultActivity;
  onClose: () => void;
}
