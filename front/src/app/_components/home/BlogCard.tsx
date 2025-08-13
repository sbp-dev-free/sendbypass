import Image from 'next/image';
import Link from 'next/link';

export const BlogCard = ({
  image,
  title,
  href,
}: {
  image: string;
  title: string;
  href: string;
}) => {
  return (
    <div className="bg-white rounded-xl p-1 space-y-3 shadow-md cursor-grab xl:cursor-default ml-4 w-11/12 xl:w-1/3">
      <Link
        href={href}
        target="_blank"
        className="w-full h-[159px] relative block"
      >
        <Image
          src={image}
          fill
          alt=""
          className="object-cover w-full rounded-lg"
        />
      </Link>
      <div className="flex items-start gap-2 justify-between text-[#1d1b20]">
        <div className="text-sm font-medium pb-2 pl-2 line-clamp-2 overflow-hidden h-5">
          {title}
        </div>
      </div>
    </div>
  );
};
