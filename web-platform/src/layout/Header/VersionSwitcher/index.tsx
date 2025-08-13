import Image from "next/image";

export const VersionSwitcher = () => {
  return (
    <div className="py-16 bg-surface-tint">
      <div className="flex gap-x-8 justify-center items-start px-8 lg:items-center">
        <Image
          src="/images/header/Party.svg"
          width={24}
          height={24}
          alt="Celebration icon"
          priority
        />
        <div className="flex flex-col gap-4 items-start md:flex-row lg:items-center">
          <strong className="lg:text-label-large text-label-medium text-inverse-on-surface">
            You are currently accessing the beta release.
          </strong>
          <span className="text-body-small lg:text-body-medium text-inverse-on-surface">
            To use the previous version, please{" "}
            <a
              href="https://pre.sendbypass.com"
              className="underline text-on-primary text-label-medium lg:text-label-large focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Switch to previous version"
              target="_blank"
              rel="noopener noreferrer"
            >
              click here
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};
