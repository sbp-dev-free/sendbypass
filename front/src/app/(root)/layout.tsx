'use client';

import { FC } from 'react';
import { Layout as AntLayout } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { RootLayoutProps } from '../layout';
import Nav from '../_components/Nav';
import ControlBar from '../_components/ControlBar';
import { Footer } from '../_components/Footer';

interface LayoutProps extends RootLayoutProps {}

const Layout: FC<LayoutProps> = ({ children = null }) => (
  <AntLayout className="min-h-screen bg-[#FEF7FF] pb-16 sm:pb-0">
    <Header className="w-full p-0 !bg-transparent mt-4">
      <Nav />
    </Header>
    {children}
    <ControlBar />
    <Footer />
  </AntLayout>
);

export default Layout;
