import { useState } from 'react'
import { useMount } from 'react-use'


const useEnsureMounted = () => {
  const [isMounted, setMounted] = useState<boolean>(false)
  useMount(() => setMounted(true))

  return isMounted
}


export default useEnsureMounted
