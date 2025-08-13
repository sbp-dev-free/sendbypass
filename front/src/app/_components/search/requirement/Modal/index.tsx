import { FC } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Form, Modal, Input, Select, message } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import TextArea from 'antd/es/input/TextArea';
import useFetcher from '@/app/_hooks/useFetcher';
import { TbSquareRoundedPlus } from 'react-icons/tb';
import Requirement from '@/app/_dtos/requirement';
import URLS from '@/app/_configs/urls';
import { RequestPost } from '@/app/_dtos/request';
import { injectAccessToken } from '@/app/_utils/fetcher';
import { PaginatedServices, ServiceGet } from '@/app/_dtos/service';
import RequirementInfo from '../Info';

const onSubmit =
  (onClose: RequirementModalProps['onClose'], messageApi: MessageInstance) =>
  async (values: RequestPost) => {
    const newConfig = await injectAccessToken(true);

    if (!newConfig) {
      return;
    }

    try {
      await axios.post(URLS.requests(), values, newConfig);

      messageApi.success('Request submitted successfully!');

      onClose();
    } catch (e) {
      console.error('failed to submit request');
      messageApi.error('Failed to submit request!');
    }
  };

interface RequirementModalProps {
  visible: boolean;
  onClose: () => void;
  requirement: Requirement;
}

const RequirementModal: FC<RequirementModalProps> = ({
  visible,
  onClose,
  requirement,
}) => {
  const serviceGetParams: ServiceGet = {
    requirement: requirement.id,
  };

  const { data: servicesResponse } = useFetcher<PaginatedServices>({
    url: URLS.services(),
    config: {
      params: serviceGetParams,
    },
    shouldFetch: visible,
    isProtected: true,
  });

  const services = servicesResponse?.results || [];

  const [form] = Form.useForm();

  const [messageApi, messageContextHolder] = message.useMessage();

  return (
    <>
      {messageContextHolder}
      <Modal
        centered
        closeIcon={null}
        okText="Send"
        onCancel={onClose}
        onOk={() => form.submit()}
        open={visible}
        title="Submit your request"
        width={840}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col justify-between gap-3">
            <RequirementInfo requirement={requirement} isModal />
          </div>

          <Form
            className="flex flex-col gap-4"
            form={form}
            initialValues={{ requirement: requirement.id }}
            layout="vertical"
            onFinish={onSubmit(onClose, messageApi)}
          >
            <Form.Item className="hidden" name="requirement">
              <Input />
            </Form.Item>

            <div className="flex gap-4 flex-wrap">
              <Form.Item
                className="grow m-0"
                label="Select a trip"
                name="service"
                required
                rules={[
                  { required: true, message: 'Please select a service!' },
                ]}
              >
                <Select placeholder="Flight number">
                  {services.map((service) => (
                    <Select.Option key={service.id} value={service.id}>
                      Airline: {service.trip_data.flight.airline} - To:{' '}
                      {service.trip_data.flight.destination.location_data.city}{' '}
                      - Landing date:{' '}
                      {new Date(
                        service.trip_data.flight.destination.to,
                      ).toLocaleDateString()}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                className="grow m-0"
                label="Proposed price"
                name={['deal', 'cost']}
                required
                rules={[
                  { required: true, message: 'Proposed price is required' },
                ]}
              >
                <Input />
              </Form.Item>
            </div>

            <div className="flex">
              <Link
                className="flex justify-center items-center p-0 m-0 text-blue-600"
                href="/trips/create"
                target="_blank"
              >
                <TbSquareRoundedPlus className="text-lg" />
                New Trip
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

export default RequirementModal;
