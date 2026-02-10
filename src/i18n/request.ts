import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({locale}) => {
  if (!locale) throw new Error('Locale is required');
  
  try {
    return {
      locale,
      messages: (await import(`../messages/${locale}.json`)).default
    };
  } catch (error) {
    console.error(`Failed to load messages for locale "${locale}":`, error);
    throw new Error(`Failed to load messages for locale "${locale}"`);
  }
});