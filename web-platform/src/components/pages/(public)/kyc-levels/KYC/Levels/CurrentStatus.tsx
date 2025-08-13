import { StatusShape } from "@/components/icons";
export const CurrentStatus = () => {
  return (
    <div className="absolute top-0 right-[20px] left-auto text-body-small px-4">
      <StatusShape className="text-positive-opacity-8" />
      <span
        className="absolute block top-0 mx-auto left-0 right-0
                           text-center pt-2 first-letter:uppercase text-label-small text-positive"
      >
        Current Status
      </span>
    </div>
  );
};
