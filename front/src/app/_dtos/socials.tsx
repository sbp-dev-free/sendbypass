import {
  FacebookFilled,
  InstagramOutlined,
  LinkedinFilled,
  WechatFilled,
  WhatsAppOutlined,
} from '@ant-design/icons';
import { Image } from 'antd';
import { FaTelegram, FaViber } from 'react-icons/fa6';

export const socialOptions = [
  {
    label: 'WhatsApp',
    value: 'whatsapp',
    emoji: <WhatsAppOutlined className="text-[#25D366]" />,
    phoneRelated: true,
  },
  {
    label: 'Telegram',
    value: 'telegram',
    emoji: <FaTelegram className="text-blue-400" />,
    phoneRelated: true,
  },
  {
    label: 'Viber',
    value: 'viber',
    emoji: <FaViber className="text-purple-400" />,
    phoneRelated: true,
  },
  {
    label: 'Facebook',
    value: 'facebook',
    emoji: <FacebookFilled className="text-blue-500" />,
    phoneRelated: false,
  },
  {
    label: 'WeChat',
    value: 'wechat',
    emoji: <WechatFilled className="text-[#09B83E]" />,
    phoneRelated: true,
  },
  {
    label: 'Line',
    value: 'line',
    emoji: (
      <Image
        src="/img/line.png"
        preview={false}
        className="w-[15px] h-[15px]"
      />
    ),
    phoneRelated: true,
  },
  {
    label: 'Instagram',
    value: 'instagram',
    emoji: <InstagramOutlined className="text-pink-500" />,
    phoneRelated: false,
  },
  {
    label: 'Linkedin',
    value: 'linkedin',
    emoji: <LinkedinFilled className="text-blue-600" />,
    phoneRelated: false,
  },
];
