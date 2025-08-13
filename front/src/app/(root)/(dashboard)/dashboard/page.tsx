'use client';

import Link from 'next/link';
import { Button } from 'antd';
import { FaPlus } from 'react-icons/fa';
import { PiAirplaneTilt, PiHandshake } from 'react-icons/pi';
import { GetProfileType } from '@/app/_components/Profile/types';
import useFetcher from '@/app/_hooks/useFetcher';
import URLS from '@/app/_configs/urls';

const DashboardPage = () => {
  const { data: profile } = useFetcher<GetProfileType>({
    url: URLS.profile(),
    isProtected: true,
  });
  return (
    <div className="h-full p-2 rounded-md">
      <div className="flex flex-col xl:flex-row gap-8">
        {profile?.type !== 'BUSINESS' && (
          <div className="flex flex-col gap-4 grow h-40 bg-[#67548e]/15 shadow-sm items-center justify-center rounded-md border border-solid border-neutral-300">
            <PiAirplaneTilt className="text-5xl text-[#67548e]" />

            <Link href="/trips/create">
              <Button
                type="primary"
                icon={<FaPlus className="size-[10px] lg:size-[14px]" />}
              >
                <span className="hidden lg:inline">New </span>
                <span>Trip</span>
              </Button>
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-4 grow h-40 bg-[#67548e]/15 shadow-sm items-center justify-center rounded-md border border-solid border-neutral-300">
          <PiHandshake className="text-5xl text-[#67548e]" />

          <Link href="/requirements/create">
            <Button
              type="primary"
              icon={<FaPlus className="size-[10px] lg:size-[14px]" />}
            >
              <span className="hidden lg:inline">New </span>
              <span>Requirement</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
