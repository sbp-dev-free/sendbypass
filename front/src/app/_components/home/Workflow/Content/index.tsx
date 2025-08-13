import { FC } from 'react';
import { Image, Typography } from 'antd';

const { Paragraph } = Typography;

interface TabItem {
  activeText: string;
  normalText: string;
}

const tabItems: TabItem[] = [
  {
    activeText: '1. Tell us about your order',
    normalText: '1. Tell us about your trips',
  },
  {
    activeText:
      '2. Find an order you can deliver from sender or shopper and make an offer or wait for them to make offers',
    normalText:
      '2. Find a passenger and make an offer or wait for them to make offers',
  },
  {
    activeText: '3. Confirm details with your passenger',
    normalText: '3. Confirm details with your sender or shopper',
  },
];

interface ContentProps {
  activeIndex: number;
}

const Content: FC<ContentProps> = ({ activeIndex }) => (
  <div className="flex sm:flex-row flex-col sm:justify-between justify-center mt-6">
    <div className="sm:w-64 w-full">
      <Image
        alt="for shopper"
        className="self-center object-scale-down"
        preview={false}
        rootClassName="h-44 flex"
        src="/img/cards/for-shopper.png"
      />
      <Paragraph className="break-normal mt-4 text-lg text-center">
        {activeIndex === 0 ? tabItems[0].activeText : tabItems[0].normalText}
      </Paragraph>
    </div>

    <div className="sm:w-64 w-full">
      <Image
        alt="for shopper"
        className="self-center object-scale-down"
        preview={false}
        rootClassName="h-44 flex"
        src="/img/cards/for-passenger.png"
      />
      <Paragraph className="break-normal mt-4 text-lg text-center">
        {activeIndex === 1 ? tabItems[1].activeText : tabItems[1].normalText}
      </Paragraph>
    </div>

    <div className="sm:w-64 w-full">
      <Image
        alt="for shopper"
        className="self-center object-scale-down"
        preview={false}
        rootClassName="h-44 flex"
        src="/img/cards/for-sender.png"
      />
      <Paragraph className="break-normal mt-4 text-lg text-center">
        {activeIndex === 2 ? tabItems[2].activeText : tabItems[2].normalText}
      </Paragraph>
    </div>
  </div>
);

export default Content;
