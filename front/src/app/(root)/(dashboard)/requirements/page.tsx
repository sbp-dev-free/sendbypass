'use client';

import { FC } from 'react';
import Link from 'next/link';
import { Button, Divider, List } from 'antd';
import { FaPlus } from 'react-icons/fa';
import useFetcher from '@/app/_hooks/useFetcher';
import PaginatedRequirements from '@/app/_dtos/requirements';
import URLS from '@/app/_configs/urls';
import RequirementCard from '@/app/_components/requirements/Card';
import Typography from 'antd/es/typography/Typography';

const RequirementsPage: FC = () => {
  const {
    data: requirementsResponse,
    isLoading,
    mutate,
  } = useFetcher<PaginatedRequirements>({
    url: URLS.requirements(),
    isProtected: true,
  });
  const requirements = requirementsResponse?.results || [];

  return (
    <div className="h-full px-2 pt-2 pb-8">
      <div className="flex justify-between flex-wrap gap-2">
        <Typography className="text-xl font-extrabold">
          My Requirements
        </Typography>
        <Link href="/requirements/create">
          <Button icon={<FaPlus />} type="primary" size="large">
            <span className="hidden md:block">New Requirement</span>
          </Button>
        </Link>
      </div>

      <Divider className="mt-4 mb-6" />

      <List
        dataSource={requirements}
        loading={isLoading}
        renderItem={(requirement) => (
          <RequirementCard requirement={requirement} mutate={mutate} />
        )}
        size="large"
      />
    </div>
  );
};

export default RequirementsPage;
