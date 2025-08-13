import { FaBusinessTime } from 'react-icons/fa6';
import { LuSendHorizonal } from 'react-icons/lu';
import { HiOutlineViewGridAdd } from 'react-icons/hi';
import { MdOutlineFlightTakeoff } from 'react-icons/md';

export const ControlBarItems = [
  {
    icon: <MdOutlineFlightTakeoff size={24} />,
    label: 'Trips',
    url: '/trips',
  },
  {
    icon: <HiOutlineViewGridAdd size={24} />,
    label: 'Requirements',
    url: '/requirements',
  },
  {
    icon: <LuSendHorizonal size={24} />,
    label: 'Requests',
    url: '/requests',
  },
  {
    icon: <FaBusinessTime size={24} />,
    label: 'Orders',
    url: '/orders',
  },
];
