import { LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import { FaPlane } from 'react-icons/fa6';
import { MdOutlineDashboard } from 'react-icons/md';

export const dashboardItems: MenuProps['items'] = [
  {
    key: 'dashboard',
    label: <Link href="/dashboard">Dashboard</Link>,
    icon: <MdOutlineDashboard />,
  },
  {
    key: 'requirements',
    label: <Link href="/requirements">Requirements</Link>,
    icon: <FaShoppingCart />,
  },
  {
    key: 'trips',
    label: <Link href="/trips">Trips</Link>,
    icon: <FaPlane />,
  },
  {
    key: 'profile',
    label: <Link href="/profile">Profile</Link>,
    icon: <ProfileOutlined />,
  },
  {
    key: 'logout',
    label: (
      <Link href="/" replace>
        Logout
      </Link>
    ),
    icon: <LogoutOutlined />,
  },
];
