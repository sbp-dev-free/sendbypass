import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
      },
    },
    extend: {
      borderRadius: {
        none: '0px',
        'extra-small': '2px',
        small: '8px',
        medium: '12px',
        large: '16px',
        'extra-large': '28px',
        full: '9999px',
      },
      fontSize: {
        'display-large': [
          '57px',
          {
            lineHeight: '64px',
            fontWeight: '700',
          },
        ],
        'display-medium': [
          '45px',
          {
            lineHeight: '52px',
            fontWeight: '700',
          },
        ],
        'display-small': [
          '36px',
          {
            lineHeight: '44px',
            fontWeight: '700',
          },
        ],
        'headline-large': [
          '32px',
          {
            lineHeight: '40px',
            fontWeight: '400',
          },
        ],
        'headline-medium': [
          '28px',
          {
            lineHeight: '36px',
            fontWeight: '400',
          },
        ],
        'headline-small': [
          '24px',
          {
            lineHeight: '32px',
            fontWeight: '400',
          },
        ],
        'title-large': [
          '22px',
          {
            lineHeight: '28px',
            fontWeight: '700',
          },
        ],
        'title-medium': [
          '16px',
          {
            lineHeight: '24px',
            fontWeight: '700',
          },
        ],
        'title-small': [
          '14px',
          {
            lineHeight: '20px',
            fontWeight: '700',
          },
        ],
        'label-large': [
          '14px',
          {
            lineHeight: '20px',
            fontWeight: '500',
          },
        ],
        'label-large-prominent': [
          '14px',
          {
            lineHeight: '20px',
            fontWeight: '700',
          },
        ],
        'label-medium': [
          '12px',
          {
            lineHeight: '16px',
            fontWeight: '500',
          },
        ],
        'label-medium-prominent': [
          '12px',
          {
            lineHeight: '16px',
            fontWeight: '700',
          },
        ],
        'label-small': [
          '11px',
          {
            lineHeight: '16px',
            fontWeight: '500',
          },
        ],
        'body-large': [
          '16px',
          {
            lineHeight: '24px',
            fontWeight: '400',
          },
        ],
        'body-medium': [
          '14px',
          {
            lineHeight: '20px',
            fontWeight: '400',
          },
        ],
        'body-small': [
          '12px',
          {
            lineHeight: '16px',
            fontWeight: '400',
          },
        ],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line global-require
    require('@tailwindcss/forms'),
  ],
  important: true,
};
export default config;
