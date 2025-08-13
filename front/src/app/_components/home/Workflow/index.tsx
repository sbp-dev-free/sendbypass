import { FC, useState } from 'react';
import { Button, Divider } from 'antd';
import clsx from 'clsx';
import Content from './Content';

const Workflow: FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <div>
      <div className="flex justify-center sm:gap-40 flex-row">
        <Button
          className={clsx({
            'sm:text-lg text-sm hover:bg-transparent hover:text-red-400 border-0 rounded-none':
              true,
            'text-red-500 border-b-4 border-solid border-red-500':
              activeIndex === 0,
          })}
          onClick={() => setActiveIndex(0)}
          size="large"
          type="text"
        >
          For shopper{' '}
        </Button>

        <Button
          className={clsx({
            'sm:text-lg text-sm hover:bg-transparent hover:text-red-400 border-0 rounded-none':
              true,
            'text-red-500 border-b-4 border-solid border-red-500':
              activeIndex === 1,
          })}
          onClick={() => setActiveIndex(1)}
          size="large"
          type="text"
        >
          For passenger{' '}
        </Button>

        <Button
          className={clsx({
            'sm:text-lg text-sm hover:bg-transparent hover:text-red-400 border-0 rounded-none':
              true,
            'text-red-500 border-b-4 border-solid border-red-500':
              activeIndex === 2,
          })}
          onClick={() => setActiveIndex(2)}
          size="large"
          type="text"
        >
          For sender{' '}
        </Button>
      </div>

      <Divider className="m-0" />

      <Content activeIndex={activeIndex} />
    </div>
  );
};

export default Workflow;
