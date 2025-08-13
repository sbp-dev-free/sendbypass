'use client';

import { Menu, Layout as AntLayout } from 'antd';
import { usePathname } from 'next/navigation';
import { useMenuData } from '@/app/_hooks/useMenuItems';

const { Sider, Content } = AntLayout;

const ApplicationsLayout = ({ children = null }) => {
  const pathname = usePathname();

  const { menuItems } = useMenuData();

  return (
    <AntLayout className="min-h-full">
      <Sider className="hidden md:block">
        <Menu
          defaultSelectedKeys={pathname.includes('all') ? ['all'] : undefined}
          className="h-full w-full"
          items={menuItems}
        />
      </Sider>
      <Content className="p-2">{children}</Content>
    </AntLayout>
  );
};

export default ApplicationsLayout;
