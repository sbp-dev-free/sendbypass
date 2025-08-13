'use client';

import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LogoImg from '../../../../../public/img/logo.svg';

const Logo: FC = () => {
  return (
    <Link href="/">
      <Image
        src={LogoImg}
        alt="Sendbypass"
        className="min-w-[90px] lg:w-auto"
      />
    </Link>
  );
};

export default Logo;
