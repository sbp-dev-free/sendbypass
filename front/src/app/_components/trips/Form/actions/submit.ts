import URLS from '@/app/_configs/urls';
import { injectAccessToken } from '@/app/_utils/fetcher';
import jsonToFormData from '@/app/_utils/formData';
import readFile from '@/app/_utils/file';
import axios from 'axios';
import { produce } from 'immer';
import { useRouter } from 'next/navigation';
import Trip from '@/app/_dtos/trip';
import { cleanObject } from '@/app/_utils/cleanObject';

const onSubmit =
  (router: ReturnType<typeof useRouter>) => async (values: any) => {
    const data = produce(values, (draft: any) => {
      /* eslint-disable */
      delete draft['images'];
      draft.flight.source.to = draft.flight.source.to.toISOString();
      draft.flight.destination.to = draft.flight.destination.to.toISOString();
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

    let trip: Trip | null = null;
    const res = await axios.post<Trip>(URLS.trips(), formData, newConfig);
    trip = res.data;

    if (!trip) {
      console.error('trip submission error');
      router.push('/trips');
      return;
    }

    router.push(`/trips/${trip.id}/services/edit`);
  };

export default onSubmit;
