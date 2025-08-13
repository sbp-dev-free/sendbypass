import URLS from '@/app/_configs/urls'
import Service from '@/app/_dtos/service'
import { injectAccessToken } from '@/app/_utils/fetcher'
import axios from 'axios'
import { useRouter } from 'next/navigation'


const onSubmit = (
  router: ReturnType<typeof useRouter>,
) => async (values: any) => {
  const newConfig = await injectAccessToken(
    true,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )

  if (!newConfig) {
    return
  }

  try {
    await axios.post<Service>(
      URLS.services(),
      values,
      newConfig,
    )
  } catch (e) {
    console.error('failed to create service')
  }
}


export default onSubmit
