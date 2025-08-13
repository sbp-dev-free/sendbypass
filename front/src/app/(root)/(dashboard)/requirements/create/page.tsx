import { FC } from 'react';
import { Divider, Tabs } from 'antd';
import Title from 'antd/es/typography/Title';
import ShippingForm from '@/app/_components/requirements/shipping/Form';
import ShoppingForm from '@/app/_components/requirements/shopping/Form';

const NewRequirementPage: FC = () => (
  <div className="h-full bg-white p-2 rounded-md">
    <Title level={4}>New Requirement</Title>

    <Divider className="mt-12 lg:my-2" />

    <Tabs
      items={[
        {
          label: 'Shipping',
          key: 'shipping',
          children: <ShippingForm />,
        },
        {
          label: 'Shopping',
          key: 'shopping',
          children: <ShoppingForm />,
        },
      ]}
      type="card"
    />
  </div>
);

export default NewRequirementPage;
