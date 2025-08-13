import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastBuildDate = new Date().toISOString().split('T')[0];
  const staticLastModifiedDate = '2025-01-19';

  return [
    {
      url: 'https://sendbypass.com',
      lastModified: lastBuildDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://sendbypass.com/about-us',
      lastModified: staticLastModifiedDate,
      changeFrequency: 'never',
      priority: 0.7,
    },
    {
      url: 'https://sendbypass.com/security',
      lastModified: staticLastModifiedDate,
      changeFrequency: 'never',
      priority: 0.7,
    },
    {
      url: 'https://sendbypass.com/faq',
      lastModified: lastBuildDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://sendbypass.com/terms-of-service',
      lastModified: staticLastModifiedDate,
      changeFrequency: 'never',
      priority: 0.6,
    },
    {
      url: 'https://sendbypass.com/contact',
      lastModified: staticLastModifiedDate,
      changeFrequency: 'never',
      priority: 0.6,
    },
    {
      url: 'https://sendbypass.com/privacy-policy',
      lastModified: staticLastModifiedDate,
      changeFrequency: 'never',
      priority: 0.6,
    },
  ];
}
