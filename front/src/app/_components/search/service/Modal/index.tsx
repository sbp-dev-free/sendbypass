import { FC } from 'react';
import Link from 'next/link';
import { Modal, Form, Input, Select, message } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import TextArea from 'antd/es/input/TextArea';
import { TbSquareRoundedPlus } from 'react-icons/tb';
import Service from '@/app/_dtos/service';
import useFetcher from '@/app/_hooks/useFetcher';
import PaginatedRequirements from '@/app/_dtos/requirements';
import URLS from '@/app/_configs/urls';
import { RequirementGet } from '@/app/_dtos/requirement';
import { RequestPost } from '@/app/_dtos/request';
import { injectAccessToken } from '@/app/_utils/fetcher';
import axios from 'axios';
import { TripType } from '@/app/_dtos/newTrip';
import TripInfo from '../../trip/Info';

interface ModalProps {
  trip: TripType;
  type: string;
  service: Service;
  onClose: () => void;
  visible: boolean;
}

const ServiceModal: FC<ModalProps> = ({
  type,
  trip,
  service,
  onClose,
  visible,
}) => {
  const requirementGetParams: RequirementGet = { service: service?.id };

  const { data: requirementsResponse } = useFetcher<PaginatedRequirements>({
    url: URLS.requirements(),
    config: {
      params: requirementGetParams,
    },
    shouldFetch: visible,
    isProtected: true,
  });

  const requirements = requirementsResponse?.results || [];

  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  // console.log(form.getFieldsValue());

  const onSubmit =
    (onClose: ModalProps['onClose'], messageApi: MessageInstance) =>
    async (values: RequestPost) => {
      const newConfig = await injectAccessToken(true);

      if (!newConfig) {
        return;
      }

      try {
        await axios.post(
          URLS.requests(),
          { ...values, service: service?.id },
          newConfig,
        );

        messageApi.success('Request submitted successfully!');

        onClose();
      } catch (e) {
        console.error('failed to submit request: ', e);
        messageApi.error('Failed to submit request!');
      }
    };

  return (
    <>
      {contextHolder}
      <Modal
        centered
        closeIcon={null}
        okText="Send"
        onCancel={onClose}
        onOk={() => form.submit()}
        okButtonProps={{ size: 'large' }}
        cancelButtonProps={{ size: 'large' }}
        open={visible}
        title="Submit your request"
        width={840}
      >
        <div className="flex flex-col gap-4">
          <TripInfo trip={trip} isModal />
          <Form
            className="flex flex-col gap-4"
            form={form}
            layout="vertical"
            onFinish={onSubmit(onClose, messageApi)}
          >
            <div className="flex gap-4">
              <Form.Item
                className="grow m-0"
                label="Select a requirement"
                name="requirement"
                required
                rules={[
                  { required: true, message: 'Please select a requirement!' },
                ]}
              >
                <Select placeholder="Requirement" allowClear>
                  {requirements.map((requirement) => (
                    <Select.Option key={requirement.id} value={requirement.id}>
                      {requirement.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                className="grow m-0"
                label="Proposed price"
                name={['deal', 'cost']}
                required
                rules={[{ required: true, message: 'Please propose a price!' }]}
              >
                <Input placeholder="Proposed price" />
              </Form.Item>
            </div>

            <div className="flex">
              <Link
                className="flex justify-center items-center p-0 m-0 text-blue-600"
                href="/requirements/create"
                target="_blank"
              >
                <TbSquareRoundedPlus className="text-lg" />
                New Requirement
              </Link>
            </div>

            <Form.Item label="Description" name="description">
              <TextArea placeholder="Type your description" />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ServiceModal;
