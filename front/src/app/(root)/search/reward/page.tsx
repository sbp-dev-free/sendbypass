'use client';

import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { List, Spin } from 'antd';
import URLS from '@/app/_configs/urls';
import useFetcher from '@/app/_hooks/useFetcher';
import paramsToObject from '@/app/_utils/paramsToObject';
import RequirementCard from '@/app/_components/search/requirement/Card';
import PaginatedRequirements from '@/app/_dtos/requirements';
import { RequirementGetSchema } from '@/app/_dtos/requirement';
import { RoleEnumSchema } from '@/app/_dtos/roles';
import { SimilarSchema } from '@/app/_dtos/similar';
import { RequirementTypeEnum } from '@/app/_dtos/requirementTypes';
import { LuFolderSearch } from 'react-icons/lu';
import { IoIosArrowDown } from 'react-icons/io';

const SearchRewardPage: FC = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const requirementGetParams = RequirementGetSchema.parse(
    paramsToObject(searchParams),
  );
  requirementGetParams.role = RoleEnumSchema.Enum.TRAVELER;
  requirementGetParams.types = RequirementTypeEnum.Enum.SHIPPING;
  requirementGetParams.similar = SimilarSchema.parse(false);

  const { data: requirementsResponse, isLoading } =
    useFetcher<PaginatedRequirements>({
      url: URLS.requirements(),
      config: {
        params: {
          ...requirementGetParams,
          service_types: searchParams.getAll('service_types'),
        },
      },
    });

  const requirements = requirementsResponse?.results || [];
  const { data: otherRequirements } = useFetcher<PaginatedRequirements>({
    url: URLS.requirements(),
    shouldFetch: !isLoading,
    config: {
      params: {
        ...requirementGetParams,
        similar: SimilarSchema.parse(true),
        service_types: searchParams.getAll('service_types'),
      },
    },
  });

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchParams.toString()]);

  return (
    <div className="p-0">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="small" />
        </div>
      ) : (
        <div>
          {requirements.length > 0 && (
            <List
              dataSource={requirements}
              renderItem={(requirement) => (
                <RequirementCard requirement={requirement} />
              )}
              size="large"
            />
          )}

          {requirements.length === 0 && (
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

          {otherRequirements && otherRequirements?.results.length > 0 && (
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
                dataSource={otherRequirements?.results || []}
                renderItem={(requirement) => (
                  <RequirementCard requirement={requirement} />
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

// const SuspenseSearchRewardPage: FC = () => {
//   return (
//     <Suspense>
//       < />
//     </Suspense>
//   );
// };

export default SearchRewardPage;
