'use client';

import { FC, Suspense } from 'react';
import { Button, Empty, List } from 'antd';
import Title from 'antd/es/typography/Title';
import URLS from '@/app/_configs/urls';
import useFetcher from '@/app/_hooks/useFetcher';
import { Trip } from '@/app/_components/trips/Trip';
import { TripResultType } from '@/app/_dtos/newTrip';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';

const TripsPage: FC = () => {
  const searchParams = useSearchParams();
  const {
    data: tripsResponse,
    isLoading,
    mutate,
  } = useFetcher<TripResultType>({
    url: URLS.trips(),
    isProtected: true,
    config: {
      params: {
        active: searchParams.get('active') ?? true,
      },
    },
  });

  const trips = tripsResponse?.results || [];

  return (
    <div className="h-full p-8 bg-white rounded-lg">
      <div className="flex justify-between">
        <div>
          <Title level={3}>My Trips</Title>
          <span>Enter your trip details accurately.</span>
        </div>
        <Button
          href="/trips/create"
          type="primary"
          size="large"
          className="hidden lg:block"
        >
          Add trip
        </Button>
      </div>

      <div className="mt-12 mb-4">
        <Button
          type="text"
          size="large"
          className={clsx('font-bold', {
            'text-[#00A58E]': searchParams.get('active')
              ? searchParams.get('active') === 'true'
              : true,
            'text-[#7A757F]': searchParams.get('active') === 'false',
          })}
          href="/trips?active=true"
        >
          Active
        </Button>
        <Button
          type="text"
          size="large"
          className={clsx('font-bold', {
            'text-[#00A58E]': searchParams.get('active') === 'false',
            'text-[#7A757F]': searchParams.get('active') === 'true',
          })}
          href="/trips?active=false"
        >
          Finished
        </Button>
      </div>
      {!isLoading && trips.length === 0 ? (
        <Empty />
      ) : (
        <List
          dataSource={trips}
          loading={isLoading}
          renderItem={(trip) => <Trip trip={trip} mutate={mutate} />}
          size="large"
        />
      )}

      <Button
        href="/trips/create"
        type="primary"
        size="large"
        className="w-full lg:hidden mt-12"
      >
        Add trip
      </Button>
    </div>
  );
};

const SuspendedTripPage = () => {
  return (
    <Suspense>
      <TripsPage />
    </Suspense>
  );
};

export default SuspendedTripPage;
