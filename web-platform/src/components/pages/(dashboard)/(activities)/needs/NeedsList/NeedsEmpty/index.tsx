import { FolderFileWarning } from "@/components/icons";

export const NeedsEmpty = () => {
  return (
    <div>
      <div className="flex flex-col justify-center py-32 mt-24">
        <div className="mx-auto">
          <FolderFileWarning />
        </div>
        <span className="block text-center text-title-small text-on-surface">
          No Needs
        </span>
        <span className="block text-center text-body-small text-outline">
          You can add some Needs here.
        </span>
      </div>
    </div>
  );
};
