'use client';

import { FC, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button } from 'antd';
import { Updater, useImmer } from 'use-immer';
import parseInt from 'lodash/parseInt';
import toNumber from 'lodash/toNumber';
import toFinite from 'lodash/toFinite';
import z from 'zod';
import Title from 'antd/es/typography/Title';
import FormState, { FormStateSchema } from '@/app/_dtos/formState';
import Service, {
  ServicePatch,
  ServicePatchSchema,
  ServicePost,
  ServicePostSchema,
  ServiceProperties,
  ShippingDocumentPropertiesSchema,
  ShippingVisibleLoadPropertiesSchema,
  ShoppingVisibleLoadPropertiesSchema,
} from '@/app/_dtos/service';
import URLS from '@/app/_configs/urls';
import axios from 'axios';
import { injectAccessToken } from '@/app/_utils/fetcher';
import RequirementType, {
  RequirementTypeEnum,
} from '@/app/_dtos/requirementTypes';
import useFetcher from '@/app/_hooks/useFetcher';
import { GetTripResultType } from '@/app/_dtos/trip';
import { BiChevronDown } from 'react-icons/bi';
import { TripReducerType } from './types';

const FormNamesEnums = z.enum(['document', 'cargo', 'shopping']);
type FormNames = z.infer<typeof FormNamesEnums>;

interface ServicesFormProps {
  tripId: string;
}

const parseServiceProperties = (
  formName: FormNames,
  values: any,
): ServiceProperties | null => {
  let serviceProperties: ServiceProperties | null = null;
  try {
    switch (formName) {
      case FormNamesEnums.Enum.document:
        serviceProperties = ShippingDocumentPropertiesSchema.parse({
          weight: values.weight,
        });
        break;
      case FormNamesEnums.Enum.cargo:
        serviceProperties = ShippingVisibleLoadPropertiesSchema.parse({
          weight: values.weight,
          height: values.height,
          length: values.length,
          width: values.width,
        });
        break;
      case FormNamesEnums.Enum.shopping:
        serviceProperties = ShoppingVisibleLoadPropertiesSchema.parse({
          weight: values.weight,
        });
        break;
      default:
        console.error('service: not supported form name');
        return null;
    }
  } catch (e) {
    console.error(
      `service: failed to parse service properties for form type ${formName}`,
      e,
    );
  }

  return serviceProperties;
};

const onSubmitService =
  (
    setFormState: Updater<Record<FormNames, FormState>>,
    formName: FormNames,
    tripId: number,
    serviceId?: number,
  ) =>
  async (values: any) => {
    const { wage, description } = values;

    setFormState((draft) => {
      // eslint-disable-next-line no-param-reassign
      draft[formName] = FormStateSchema.Enum.PENDING;
    });

    const serviceProperties = parseServiceProperties(formName, values);
    if (serviceProperties === null) {
      setFormState((draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[formName] = FormStateSchema.Enum.ERROR;
      });

      return;
    }

    let requirementType: RequirementType = RequirementTypeEnum.Enum.SHIPPING;
    if (formName === FormNamesEnums.Enum.shopping) {
      requirementType = RequirementTypeEnum.Enum.SHOPPING;
    }

    let payload: ServicePost | ServicePatch | null = null;
    try {
      if (serviceId) {
        payload = ServicePatchSchema.parse({
          type: requirementType,
          properties: serviceProperties,
          cost: {
            wage,
          },
          description,
        });
      } else {
        payload = ServicePostSchema.parse({
          trip: tripId,
          type: requirementType,
          properties: serviceProperties,
          cost: {
            wage,
          },
          description,
        });
      }
    } catch (e) {
      console.error('service: failed to parse post schema', e);
      setFormState((draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[formName] = FormStateSchema.Enum.ERROR;
      });

      return;
    }

    const newConfig = await injectAccessToken(true);

    if (!newConfig) {
      console.error('service: failed to inject access token');
      setFormState((draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[formName] = FormStateSchema.Enum.ERROR;
      });

      return;
    }

    let _service: Service | null = null;
    try {
      if (serviceId) {
        const res = await axios.patch<Service>(
          URLS.editService(String(serviceId)),

          payload,
          newConfig,
        );
        _service = res.data;
      } else {
        const res = await axios.post<Service>(
          URLS.services(),
          payload,
          newConfig,
        );
        _service = res.data;
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.error(e.message);
      } else {
        console.error(e);
      }

      setFormState((draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[formName] = FormStateSchema.Enum.ERROR;
      });

      return;
    }

    setFormState((draft) => {
      // eslint-disable-next-line no-param-reassign
      draft[formName] = FormStateSchema.Enum.SUCCESS;
    });
  };

const ServicesForm: FC<ServicesFormProps> = ({ tripId: tripIdParam }) => {
  const tripId = parseInt(tripIdParam);
  const { data: trip, mutate } = useFetcher<GetTripResultType>({
    url: URLS.trip(String(tripId)),
    isProtected: true,
  });

  const initialState: TripReducerType = {
    visibility: { document: false, cargo: false, shopping: false },
    document: {
      id: undefined,
      weight: undefined,
      wage: undefined,
      description: '',
    },
    cargo: {
      id: undefined,
      weight: undefined,
      wage: undefined,
      length: undefined,
      width: undefined,
      height: undefined,
      description: '',
    },
    shopping: {
      id: undefined,
      weight: undefined,
      wage: undefined,
      description: '',
    },
  };

  const { visibility, document, cargo, shopping } =
    trip?.services?.reduce<TripReducerType>((acc: TripReducerType, item) => {
      if (item.properties.type === 'DOCUMENT') {
        acc.document.id = item.id;
        acc.visibility.document = true;
        acc.document.weight = item.properties.weight;
        acc.document.wage = item.cost.wage;
        acc.document.description = item.description;
      } else if (
        item.type === 'SHIPPING' &&
        item.properties.type === 'VISIBLE_LOAD'
      ) {
        acc.cargo.id = item.id;
        acc.visibility.cargo = true;
        acc.cargo.weight = item.properties.weight;
        acc.cargo.wage = item.cost.wage;
        acc.cargo.height = item.properties.height;
        acc.cargo.width = item.properties.width;
        acc.cargo.length = item.properties.length;
        acc.cargo.description = item.description;
      } else if (item.type === 'SHOPPING') {
        acc.visibility.shopping = true;
        acc.shopping.id = item.id;
        acc.shopping.weight = item.properties.weight;
        acc.shopping.wage = item.cost.wage;
        acc.shopping.description = item.description;
      }
      return acc;
    }, initialState) || initialState;

  const router = useRouter();

  const [formsVisibility, setFormsVisibility] = useImmer<
    Record<FormNames, boolean>
  >({
    document: false,
    cargo: false,
    shopping: false,
  });

  useEffect(() => {
    setFormsVisibility(visibility);
  }, [trip?.id]);

  useEffect(() => {
    mutate();
  }, [visibility, mutate]);

  const [formsState, setFormsState] = useImmer<Record<FormNames, FormState>>({
    [FormNamesEnums.Enum.document]: FormStateSchema.Enum.READY,
    [FormNamesEnums.Enum.cargo]: FormStateSchema.Enum.READY,
    [FormNamesEnums.Enum.shopping]: FormStateSchema.Enum.READY,
  });

  return (
    <div className="mb-12 mt-4 flex flex-col gap-6">
      <div className="bg-white flex flex-col p-4 gap-4">
        <div className="flex items-center justify-between">
          <Title className="items-center m-0" level={5}>
            Carrying documents
          </Title>

          {formsVisibility?.document ? (
            <Button
              className="flex items-center justify-center"
              icon={<BiChevronDown className="rotate-180" size={24} />}
              onClick={() => {
                setFormsVisibility((draft) => {
                  // eslint-disable-next-line no-param-reassign
                  draft.document = false;
                });

                setFormsState((draft) => {
                  // eslint-disable-next-line no-param-reassign
                  draft.document = FormStateSchema.Enum.READY;
                });
              }}
              type="primary"
            />
          ) : (
            <Button
              className="flex items-center justify-center"
              icon={<BiChevronDown size={24} />}
              onClick={() =>
                setFormsVisibility((draft) => {
                  // eslint-disable-next-line no-param-reassign
                  draft.document = true;
                })
              }
              type="primary"
            />
          )}
        </div>

        {formsVisibility?.document && (
          <Form
            className="px-4"
            layout="vertical"
            onFinish={onSubmitService(
              setFormsState,
              FormNamesEnums.Enum.document,
              tripId,
              document.id,
            )}
            initialValues={{ ...document }}
          >
            <Form.Item hidden name="id">
              <Input />
            </Form.Item>

            <div className="flex gap-8">
              <Form.Item
                label="Weight (kg)"
                name="weight"
                normalize={(value) => toFinite(toNumber(value))}
                required
                rules={[
                  {
                    required: true,
                    type: 'number',
                    message: 'Weight is required',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <div className="flex gap-2">
                <Form.Item
                  label="Price ($)"
                  name="wage"
                  normalize={(value) => toFinite(toNumber(value))}
                  required
                  rules={[
                    {
                      required: true,
                      type: 'number',
                      message: 'Price is required',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>

            <Form.Item label="Description" name="description">
              <Input />
            </Form.Item>

            <div className="flex flex-row justify-end">
              <Button
                loading={Boolean(
                  formsState.document === FormStateSchema.Values.PENDING,
                )}
                htmlType="submit"
                type="primary"
              >
                {visibility.document ? 'Edit' : 'Add'}
              </Button>{' '}
            </div>
          </Form>
        )}
      </div>

      <div className="bg-white flex flex-col p-4 gap-4">
        <div className="flex items-center justify-between">
          <Title className="items-center m-0" level={5}>
            Allowed and visible cargo
          </Title>

          {formsVisibility?.cargo ? (
            <Button
              className="flex items-center justify-center"
              icon={<BiChevronDown className="rotate-180" size={24} />}
              onClick={() => {
                setFormsVisibility((draft) => {
                  // eslint-disable-next-line no-param-reassign
                  draft.cargo = false;
                });

                setFormsState((draft) => {
                  // eslint-disable-next-line no-param-reassign
                  draft.cargo = FormStateSchema.Enum.READY;
                });
              }}
              type="primary"
            />
          ) : (
            <Button
              className="flex items-center justify-center"
              icon={<BiChevronDown size={24} />}
              onClick={() =>
                setFormsVisibility((draft) => {
                  // eslint-disable-next-line no-param-reassign
                  draft.cargo = true;
                })
              }
              type="primary"
            />
          )}
        </div>

        {formsVisibility?.cargo && (
          <Form
            className="px-4"
            layout="vertical"
            onFinish={onSubmitService(
              setFormsState,
              FormNamesEnums.Enum.cargo,
              tripId,
              cargo.id,
            )}
            initialValues={{ ...cargo }}
          >
            <Form.Item hidden name="id">
              <Input />
            </Form.Item>

            <div className="flex gap-4">
              <Form.Item
                label="Weight (kg)"
                name="weight"
                normalize={(value) => toFinite(toNumber(value))}
                required
                rules={[
                  {
                    required: true,
                    type: 'number',
                    message: 'Weight is required',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Price ($)"
                name="wage"
                normalize={(value) => toFinite(toNumber(value))}
                required
                rules={[
                  {
                    required: true,
                    type: 'number',
                    message: 'Price is required',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <div className="flex gap-4">
                <Form.Item
                  label="Length (cm)"
                  name="length"
                  normalize={(value) => toFinite(toNumber(value))}
                  required
                  rules={[
                    {
                      required: true,
                      type: 'number',
                      message: 'Length is required',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Width (cm)"
                  name="width"
                  normalize={(value) => toFinite(toNumber(value))}
                  required
                  rules={[
                    {
                      required: true,
                      type: 'number',
                      message: 'Width is required',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Height (cm)"
                  name="height"
                  normalize={(value) => toFinite(toNumber(value))}
                  required
                  rules={[
                    {
                      required: true,
                      type: 'number',
                      message: 'Height is required',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>

            <Form.Item label="Description" name="description">
              <Input />
            </Form.Item>

            <div className="flex flex-row justify-end">
              <Button
                loading={Boolean(
                  formsState.cargo === FormStateSchema.Values.PENDING,
                )}
                htmlType="submit"
                type="primary"
              >
                {visibility.cargo ? 'Edit' : 'Add'}
              </Button>{' '}
            </div>
          </Form>
        )}
      </div>

      <div className="bg-white flex flex-col p-4 gap-4">
        <div className="flex items-center justify-between">
          <Title className="items-center m-0" level={5}>
            Shopping
          </Title>

          {formsVisibility?.shopping ? (
            <Button
              className="flex items-center justify-center"
              icon={<BiChevronDown className="rotate-180" size={24} />}
              onClick={() => {
                setFormsVisibility((draft) => {
                  // eslint-disable-next-line no-param-reassign
                  draft.shopping = false;
                });

                setFormsState((draft) => {
                  // eslint-disable-next-line no-param-reassign
                  draft.shopping = FormStateSchema.Enum.READY;
                });
              }}
              type="primary"
            />
          ) : (
            <Button
              className="flex items-center justify-center"
              icon={<BiChevronDown size={24} />}
              onClick={() =>
                setFormsVisibility((draft) => {
                  // eslint-disable-next-line no-param-reassign
                  draft.shopping = true;
                })
              }
              type="primary"
            />
          )}
        </div>

        {formsVisibility?.shopping && (
          <Form
            className="px-4"
            layout="vertical"
            onFinish={onSubmitService(
              setFormsState,
              FormNamesEnums.Enum.shopping,
              tripId,
              shopping.id,
            )}
            initialValues={{ ...shopping }}
          >
            <Form.Item hidden name="id">
              <Input />
            </Form.Item>

            <div className="flex gap-8">
              <Form.Item
                label="Weight (kg)"
                name="weight"
                normalize={(value) => toFinite(toNumber(value))}
                required
                rules={[
                  {
                    required: true,
                    type: 'number',
                    message: 'Weight is required',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <div className="flex gap-2">
                <Form.Item
                  label="Price ($)"
                  name="wage"
                  normalize={(value) => toFinite(toNumber(value))}
                  required
                  rules={[
                    {
                      required: true,
                      type: 'number',
                      message: 'Price is required',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>

            <Form.Item label="Description" name="description">
              <Input />
            </Form.Item>

            <div className="flex flex-row justify-end">
              <Button
                loading={Boolean(
                  formsState.shopping === FormStateSchema.Values.PENDING,
                )}
                htmlType="submit"
                type="primary"
              >
                {visibility.shopping ? 'Edit' : 'Add'}
              </Button>
            </div>
          </Form>
        )}
      </div>

      <div className="flex flex-row justify-end gap-4">
        <Button
          onClick={() => {
            router.push('/trips');
          }}
          type="default"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ServicesForm;
