import { FC } from 'react';
import { Divider } from 'antd';
import Title from 'antd/es/typography/Title';
import ShippingForm from '@/app/_components/requirements/shipping/Form/Edit';

const EditShippingRequirementPage: FC = () => (
  <div className="h-full bg-white p-2 rounded-md">
    <Title level={4}>Edit Shipping Requirement</Title>

    <Divider className="my-2" />

    <ShippingForm />
  </div>
);

export default EditShippingRequirementPage;
