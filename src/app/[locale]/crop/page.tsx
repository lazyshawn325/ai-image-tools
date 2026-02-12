import {setRequestLocale, getTranslations} from 'next-intl/server';
import PageClient from './PageClient';
import {routing} from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Crop'});
 
  return {
    title: t('meta_title'),
    description: t('meta_desc'),
  };
}

export default async function Page({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <PageClient />;
}
