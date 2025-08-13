'use client';

import { PlusOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Form, Input, InputNumber } from 'antd';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { FaRegFileAlt } from 'react-icons/fa';
import { RiSuitcase2Line } from 'react-icons/ri';
import { MdOutlineShoppingBag } from 'react-icons/md';
import { formatCurrency, DEFAULT_CURRENCY } from '@/app/_dtos/currency';
import { ServicePropsType } from './types';

export const Service = ({ type, services, setService }: ServicePropsType) => {
  const [isOpen, setIsOpen] = useState(false);

  const [form] = Form.useForm();
  const predefinedOptions = [{ value: 'Under 1kg' }];
  const [customWeight, setCustomWeight] = useState<number | null | string>(
    null,
  );

  const tripType =
    type === 'Cargo' || type === 'DOCUMENT' ? 'shipping' : 'shopping';

  const serviceType =
    type === 'Cargo'
      ? 'shipping:visible_load'
      : `${tripType}:${type === 'SHOPPING' ? 'visible_load' : 'document'}`;

  useEffect(() => {
    form.setFieldsValue({
      maxWeight: services?.[`${serviceType}`]?.properties?.weight,
      fee: services?.[`${serviceType}`]?.cost?.wage,
      description: services?.[`${serviceType}`]?.description,
    });
  }, [form, services, type, serviceType]);

  const onFinish = (values: any) => {
    form.setFieldsValue(values);

    const service = {
      type: tripType.toUpperCase(),
      properties: {
        type:
          type === 'SHOPPING'
            ? 'VISIBLE_LOAD'
            : type === 'Cargo'
              ? 'VISIBLE_LOAD'
              : 'DOCUMENT',
        weight: values?.maxWeight,
      },
      cost: { wage: values?.fee },
      description: values?.description,
    };

    setService({
      ...services,
      [`${serviceType}`]: { ...service },
    });
    setIsOpen(false);
  };

  const handleResetForm = () => {
    form.resetFields();
    setIsOpen(false);
    const filteredServices = { ...services };
    delete filteredServices?.[`${serviceType}`];
    setService(filteredServices);
  };

  return (
    <div
      className={clsx(
        'border border-[#CBC4CF] rounded-xl p-4 min-h-[70px] transition-[height] duration-100',
        {
          'h-[70px]': !isOpen,
          'h-[320px] lg:h-[190px]': isOpen,
        },
      )}
    >
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-4 lg:gap-8">
          <div className="flex items-center gap-2 lg:w-[105px]">
            {type === 'Cargo' && <RiSuitcase2Line size={20} />}
            {type === 'DOCUMENT' && <FaRegFileAlt size={20} />}
            {type === 'SHOPPING' && <MdOutlineShoppingBag size={20} />}
            <div className="text-xs lg:text-sm tex-[#1D1B20] capitalize">
              {type?.toLowerCase()}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-8">
            {form.getFieldValue('maxWeight') && (
              <div className="text-xs lg:text-sm text-[#1D1B20] font-medium max-weight">
                Max weight:
                {form.getFieldValue('maxWeight') === 'Under 1kg'
                  ? form.getFieldValue('maxWeight').replace('kg', '').trim()
                  : form.getFieldValue('maxWeight')}{' '}
                <sub className="text-[#7A757F]">kg</sub>
              </div>
            )}
            {form.getFieldValue('fee') && (
              <div className="text-xs lg:text-sm text-[#1D1B20] font-medium">
                Fee:{formatCurrency(form.getFieldValue('fee'))}{' '}
                <sub className="text-[#7A757F]">per kilo</sub>
              </div>
            )}
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          className="bg-[#65558F14] text-[#67548E]"
          icon={
            <PlusOutlined
              size={20}
              className={`transition-all duration-300 ${isOpen ? 'rotate-45' : ''}`}
            />
          }
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      <Form
        form={form}
        onFinish={onFinish}
        className={clsx('grow mt-4', {
          hidden: !isOpen,
        })}
      >
        <div className="flex flex-col lg:flex-row items-center lg:gap-4">
          <Form.Item
            name="maxWeight"
            className="w-full lg:w-1/5"
            rules={[{ required: true, message: 'Max Weight is required' }]}
          >
            {type !== 'DOCUMENT' ? (
              <InputNumber
                placeholder="Max Weight(kg)"
                size="large"
                className="w-full"
              />
            ) : (
              <AutoComplete
                style={{ width: '100%' }}
                size="large"
                options={predefinedOptions}
                placeholder="Max Weight (kg)"
                value={customWeight !== null ? `${customWeight}` : undefined}
                onSelect={(value) => {
                  if (value === 'Under 1kg') {
                    setCustomWeight('Under 1kg');
                    form.setFieldsValue({ maxWeight: 'Under 1kg' });
                  } else {
                    const numericValue = parseFloat(value);
                    setCustomWeight(numericValue);
                    form.setFieldsValue({ maxWeight: numericValue });
                  }
                }}
                onChange={(value) => {
                  if (value === 'Under 1kg') {
                    setCustomWeight('Under 1kg');
                    form.setFieldsValue({ maxWeight: 'Under 1kg' });
                  } else {
                    const numericValue = parseFloat(value);
                    if (!isNaN(numericValue)) {
                      setCustomWeight(numericValue);
                      form.setFieldsValue({ maxWeight: numericValue });
                    }
                  }
                }}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <div style={{ display: 'flex', padding: 8 }}>
                      <InputNumber
                        placeholder="Custom weight"
                        min={0}
                        style={{ flex: 1 }}
                        value={customWeight}
                        onChange={(value) => {
                          setCustomWeight(value);
                          form.setFieldsValue({ maxWeight: value });
                        }}
                      />
                    </div>
                  </>
                )}
              />
            )}
          </Form.Item>
          <Form.Item
            name="fee"
            className="w-full lg:w-1/5"
            rules={[{ required: true, message: 'Fee is required' }]}
          >
            <InputNumber
              placeholder={`Fee(${DEFAULT_CURRENCY.symbol})`}
              size="large"
              className="w-full"
            />
          </Form.Item>
          <Form.Item name="description" className="w-full lg:w-3/5">
            <Input placeholder="Description" size="large" />
          </Form.Item>
        </div>
        <div className="flex gap-2 justify-center lg:justify-end">
          <Button
            type="primary"
            size="large"
            className="bg-transparent text-[#67548E] w-full lg:w-auto"
            onClick={handleResetForm}
          >
            Remove
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            className="bg-[#65558F14] text-[#67548E] w-full lg:w-auto"
          >
            Apply
          </Button>
        </div>
      </Form>
    </div>
  );
};
