import { FC } from 'react';
import { Layout as AntLayout } from 'antd';
import Image from 'next/image';
import Typography from 'antd/es/typography/Typography';
import { RootLayoutProps } from '../layout';

interface LayoutProps extends RootLayoutProps {}

const Layout: FC<LayoutProps> = ({ children = null }) => (
  <AntLayout className="flex flex-row h-screen w-screen bg-[#FEF7FF]">
    <div className="h-full w-full md:w-1/2 lg:w-1/3 mx-auto">{children}</div>
    <div className="relative md:w-[55%] hidden md:flex">
      <Image
        className="object-cover object-center"
        fill
        src="/img/auth/luggage.jpg"
        alt="Luggage Image"
      />
      <Typography className="absolute z-10 bottom-40 left-20 text-white font-black text-3xl drop-shadow-2xl">
        Sendbypass helps you send your loads easily with a simple user
        interface.
      </Typography>
    </div>
  </AntLayout>
);

export default Layout;
