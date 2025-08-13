import FAQ from '@/app/_components/faq';

const FaqPage = async ({
  searchParams,
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => <FAQ searchParams={searchParams} />;

export default FaqPage;
