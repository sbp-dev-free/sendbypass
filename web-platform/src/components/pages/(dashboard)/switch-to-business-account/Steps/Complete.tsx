import { CheckBadge } from "@/components/icons";
export const Complete = () => {
  return (
    <div className="flex flex-col justify-center items-center rounded-large bg-surface-container-lowest py-32 px-24">
      <CheckBadge />
      <h1 className="text-title-large text-on-positive mb-4">Success!</h1>
      <p className="text-title-medium text-on-surface mb-8">
        Your request has been sent.
      </p>
      <p className="text-body-medium text-on-surface-variant">
        You will be notified by email once your request is reviewed.
      </p>
    </div>
  );
};
