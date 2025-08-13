import Link from 'next/link';
import { CATEGORIES, QUESTIONS } from '@/app/_dtos/static-pages';
import { Button, Collapse } from 'antd';
import { StaticPageFrame } from '../StaticPageFrame';

const FAQ = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { category: activeCategory } = await searchParams;

  const filteredQuestions = !activeCategory
    ? QUESTIONS
    : QUESTIONS.filter((question) => question.category === activeCategory);

  return (
    <StaticPageFrame title="FAQ">
      <div className="flex flex-col gap-[20px] justify-center items-center">
        <div className="max-w-[828px] text-center space-y-[24px]">
          <header className="space-y-12">
            <h4 className="text-title-large text-on-surface">
              Frequently asked questions (FAQ)
            </h4>
            <div className="space-y-4 text-body-medium text-on-surface">
              <p className="whitespace-normal break-words">
                These are the most commonly asked questions about Sendbypass.
              </p>

              <p>
                Can&apos;t find what you&apos;re looking for?{' '}
                <span>
                  <Button type="text" href="/contact">
                    Send a message!
                  </Button>
                </span>
              </p>
            </div>
          </header>
          <div className="flex flex-wrap gap-[16px] items-center justify-center">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                href={category === 'All' ? '/faq' : `/faq?category=${category}`}
                className={`inline-flex flex-shrink-0 gap-[8px] items-center ${activeCategory === category ? 'text-[#67548E]' : 'text-gray-500'}`}
              >
                <span
                  className={`rounded-full size-[6px] ${activeCategory === category ? 'bg-[#67548E]' : 'bg-gray-400'}`}
                />
                <p className="text-body-medium">{category}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="max-w-[828px]">
          <Collapse
            className="lg:w-[828px]"
            items={filteredQuestions}
            defaultActiveKey={['1']}
          />
        </div>
      </div>
    </StaticPageFrame>
  );
};

export default FAQ;
