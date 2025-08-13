import Image from "next/image";
import Link from "next/link";
export const Application = () => {
  return (
    <div className="bg-surface-container-high rounded-extra-large pt-16 px-16 grid grid-cols-1 md:grid-cols-2 md:pt-0 md:px-40">
      <div className="flex justify-center items-center flex-col md:items-start">
        <h4 className="font-light text-[27px] md:text-[36px] text-on-surface text-center md:text-left">
          Experience Simplicity.
          <br />
          <span className="font-semibold">Download the App Now!</span>
        </h4>
        <span className="mt-4 text-label-large text-on-surface">
          Available on Android
        </span>
        <Link
          href={
            "https://play.google.com/store/apps/details?id=com.sendbypass.m&hl=en_NZ"
          }
          className="my-24 md:mt-48"
        >
          <Image
            src="/images/home/application/Mobile app store badge.png"
            alt="Mobile app store badge"
            className=""
            width={135}
            height={40}
          />
        </Link>
      </div>
      <div className="md:flex md:gap-40 md:justify-end">
        <Image
          src="/images/home/application/Phone SM.webp"
          alt="Mobile application interface displayed on a smartphone"
          className="object-cover block md:hidden"
          width={356}
          height={400}
        />
        <div className="md:pt-64">
          <Image
            src="/images/home/application/Phone 2.webp"
            alt="Mobile application interface displayed on a smartphone"
            className="object-cover hidden md:block"
            width={230}
            height={360}
          />
        </div>
        <div>
          <Image
            src="/images/home/application/Phone 1.webp"
            alt="Mobile application interface displayed on a smartphone"
            className="object-cover hidden md:block"
            width={220}
            height={360}
          />
        </div>
      </div>
    </div>
  );
};
