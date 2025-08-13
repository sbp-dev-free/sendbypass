import { FC } from 'react'
import clsx from 'clsx'
import { Button } from 'antd'
import FormState, { FormStateSchema } from '@/app/_dtos/formState'


interface SubmitButtonProps {
  state: FormState
}


const SubmitButton: FC<SubmitButtonProps> = ({ state }) => {
  let text: string = 'Send'
  switch (state) {
  case FormStateSchema.Values.PENDING:
    text = 'Sending...'
    break
  case FormStateSchema.Values.SUCCESS:
    text = 'Sent!'
    break
  case FormStateSchema.Values.ERROR:
    text = 'Retry'
    break
  default:
    break
  }

  return (
    <Button
      className={clsx({
        'text-white bg-amber-500': state === FormStateSchema.Values.PENDING,
        'text-white bg-lime-500': state === FormStateSchema.Values.SUCCESS,
        'text-white bg-rose-500': state === FormStateSchema.Values.ERROR,
      })}
      disabled={
        state === FormStateSchema.Values.PENDING
                  || state === FormStateSchema.Values.SUCCESS
      }
      htmlType="submit"
      type="primary"
    >
      {text}
    </Button>
  )
}


export default SubmitButton
