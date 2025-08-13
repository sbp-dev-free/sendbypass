import { FC } from 'react';
import { Divider } from 'antd';
import Title from 'antd/es/typography/Title';
import ShoppingForm from '@/app/_components/requirements/shopping/Form/Edit';

const EditShoppingRequirementPage: FC = () => (
  <div className="h-full bg-white p-2 rounded-md">
    <Title level={4}>Edit Shopping Requirement</Title>
    <Divider className="my-2" />
    <ShoppingForm />
  </div>
);

export default EditShoppingRequirementPage;
