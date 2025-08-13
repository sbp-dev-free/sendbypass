import { FolderFileSearch } from "@/components/icons";

export const EmptyResult = () => {
  return (
    <div className="flex flex-col gap-4 justify-center items-center py-24 bg-cover border-2 rounded-medium border-outline-variant-opacity-8 bg-surface-container-lowest">
      <FolderFileSearch />
      <div className="text-label-large-prominent text-on-surface">
        Empty results, at the moment
      </div>
      <div className="text-body-small text-outline">
        Don&apos;t worry—new opportunities are added all the time!
      </div>
    </div>
  );
};
