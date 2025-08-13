'use client';

import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { List, Spin } from 'antd';
import URLS from '@/app/_configs/urls';
import useFetcher from '@/app/_hooks/useFetcher';
import { TripGetSchema } from '@/app/_dtos/trip';
import TripCard from '@/app/_components/search/trip/Card';
import paramsToObject from '@/app/_utils/paramsToObject';
import { RoleEnumSchema } from '@/app/_dtos/roles';
import { SimilarSchema } from '@/app/_dtos/similar';
import { TripResultType } from '@/app/_dtos/newTrip';
import { LuFolderSearch } from 'react-icons/lu';
import { IoIosArrowDown } from 'react-icons/io';

const SearchSendPage: FC = () => {
  const searchParams = useSearchParams();
  const tripGetParams = TripGetSchema.parse(paramsToObject(searchParams));
  tripGetParams.role = RoleEnumSchema.Enum.CUSTOMER;
  tripGetParams.similar = SimilarSchema.parse(false);
  const [loading, setLoading] = useState(false);

  const { data: tripsResponse, isLoading } = useFetcher<TripResultType>({
    url: URLS.trips(),
    config: {
      params: tripGetParams,
    },
  });

  const trips = tripsResponse?.results || [];

  const { data: otherTrips } = useFetcher<TripResultType>({
    url: URLS.trips(),
    shouldFetch: !isLoading,
    config: {
      params: {
        ...tripGetParams,
        role: RoleEnumSchema.Enum.CUSTOMER,
        similar: SimilarSchema.parse(true),
      },
    },
  });

  const [pinnedTrips, setPinnedTrips] = useState<number[]>([]);

  useEffect(() => {
    const storedPinnedTrips = JSON.parse(
      localStorage.getItem('pinnedTrips') || '[]',
    );
    setPinnedTrips(storedPinnedTrips);
  }, []);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchParams.toString()]);

  const handlePinToggle = (tripId: number) => {
    let updatedPinnedTrips = [...pinnedTrips];
    if (pinnedTrips.includes(tripId)) {
      updatedPinnedTrips = updatedPinnedTrips.filter((id) => id !== tripId);
    } else {
      updatedPinnedTrips.push(tripId);
    }
    setPinnedTrips(updatedPinnedTrips);
    localStorage.setItem('pinnedTrips', JSON.stringify(updatedPinnedTrips));
  };

  const sortedTrips = [...trips].sort((a) => {
    return pinnedTrips.includes(a.id) ? -1 : 1;
  });

  return (
    <div className="p-0">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="small" />
        </div>
      ) : (
        <div>
          {sortedTrips.length > 0 && (
            <List
              dataSource={sortedTrips}
              renderItem={(trip) => (
                <TripCard
                  trip={trip}
                  isPinned={pinnedTrips.includes(trip.id)}
                  onPinToggle={handlePinToggle}
                />
              )}
              size="large"
            />
          )}

          {sortedTrips.length === 0 && (
            <div className="bg-white rounded p-12 flex flex-col gap-4 items-center justify-center">
              <LuFolderSearch size={42} className="text-[#67548E]" />
              <div className="text-sm font-bold text-[#1D1B1F] text-center">
                Empty results, at the moment
              </div>
              <div className="text-xs text-[#7A7580] text-center">
                Don&apos;t worry—new opportunities are added all the time!
              </div>
            </div>
          )}

          {otherTrips && otherTrips?.results.length > 0 && (
            <div className="py-3 px-2 bg-[#F3EDF7] rounded mt-2">
              <div>
                <div className="text-center text-[#67548E] text-sm font-bold mb-1">
                  Keep exploring
                </div>
                <div className="text-center text-[#67548E] text-xs font-normal mb-1">
                  Feel free to look through these other results
                </div>
                <IoIosArrowDown
                  size={18}
                  className="text-[#67548E] mx-auto mb-2"
                />
              </div>
              <List
                dataSource={otherTrips?.results || []}
                renderItem={(trip) => (
                  <TripCard trip={trip} onPinToggle={handlePinToggle} />
                )}
                size="large"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// const SuspenseSearchSendPage: FC = () => {
//   return (
//     <Suspense>
//       < />
//     </Suspense>
//   );
// };

export default SearchSendPage;
