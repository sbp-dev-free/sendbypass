import Link from 'next/link';

export const orderItems: any[] = [
  {
    key: 'current-orders',
    label: 'Current Orders',
    children: [
      {
        key: 'my-trips',
        label: <Link href="/orders?role=TRAVELER">My Trips</Link>,
      },
      {
        key: 'my-requirements',
        label: <Link href="/orders?role=CUSTOMER">My Requirements</Link>,
      },
    ],
  },
  {
    key: 'delivered-orders',
    label: <Link href="/orders?status=DELIVERED">Delivered Orders</Link>,
  },
  {
    key: 'cancelled-orders',
    label: <Link href="/orders?status=CANCELLED">Cancelled Orders</Link>,
  },
];

export const orderItemsMobile: any[] = [
  {
    key: 'my-trips',
    label: <Link href="/orders?role=TRAVELER">My Trips</Link>,
  },
  {
    key: 'my-requirements',
    label: <Link href="/orders?role=CUSTOMER">My Requirements</Link>,
  },
  {
    key: 'delivered-orders',
    label: <Link href="/orders?status=DELIVERED">Delivered Orders</Link>,
  },
  {
    key: 'cancelled-orders',
    label: <Link href="/orders?status=CANCELLED">Cancelled Orders</Link>,
  },
];

export const sortItems = [
  {
    key: 'submit_time',
    label: <Link href="/orders?ordering=submit_time">Ascending</Link>,
  },
  {
    key: '-submit_time',
    label: <Link href="/orders?ordering=-submit_time">Descending</Link>,
  },
];
