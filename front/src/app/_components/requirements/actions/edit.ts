import URLS from '@/app/_configs/urls';
import RequirementPayloadTypeEnum from '@/app/_dtos/requirementPayloadTypes';
import RequirementType from '@/app/_dtos/requirementTypes';
import { cleanObject } from '@/app/_utils/cleanObject';
import { injectAccessToken } from '@/app/_utils/fetcher';
import readFile from '@/app/_utils/file';
import jsonToFormData from '@/app/_utils/formData';
import axios from 'axios';
import dayjs from 'dayjs';
import { produce } from 'immer';
import { useRouter } from 'next/navigation';

const onSubmit =
  (router: ReturnType<typeof useRouter>, type: RequirementType, id: string) =>
  async (values: any) => {
    const data = produce(values, (draft: any) => {
      /* eslint-disable */
      delete draft['images'];
      draft.type = type;
      draft.destination.to = dayjs(draft.to)
        .add(23, 'hours')
        .format('YYYY-MM-DDThh');

      if (!draft.properties.type) {
        draft.properties.type = RequirementPayloadTypeEnum.enum.OTHER;
      }
      if (id) {
        delete draft.source;
        delete draft.destination.location;
      }
      /* eslint-enable */
    });

    const formData = jsonToFormData(cleanObject(data));

    const { images } = values;
    if (images) {
      const imageFile: File = values.images[0].originFileObj;

      try {
        const imageBlob = await readFile(imageFile);
        formData.append('image', imageBlob, imageFile.name);
      } catch (e) {
        console.error('failed to read image file');
      }
    }

    const newConfig = await injectAccessToken(true, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!newConfig) {
      return;
    }
    await axios.patch(URLS.editRequirement(id), formData, newConfig);

    router.push('/requirements');
  };

export default onSubmit;
