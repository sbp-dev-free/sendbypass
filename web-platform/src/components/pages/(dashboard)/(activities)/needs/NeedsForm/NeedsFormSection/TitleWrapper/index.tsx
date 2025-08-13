import { TitleWrapperProps } from "./types";

export const TitleWrapper = ({
  title,
  subtitle,
  children,
  className = "",
  extraRender,
}: TitleWrapperProps) => {
  return (
    <div
      className={`p-16 rounded-medium border-surface-container-high border ${className}`}
    >
      <div className="md:pl-12 flex flex-col md:flex-row justify-between items-center gap-y-[10px]">
        <div className="w-full md:w-auto">
          <div className="mb-6 text-label-large text-on-surface">{title}</div>
          <div className="text-body-small text-outline">{subtitle}</div>
        </div>
        <div className="w-full md:w-auto">{extraRender}</div>
      </div>
      <div className="mt-16">{children}</div>
    </div>
  );
};
