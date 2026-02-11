import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
 
export default getRequestConfig(async ({locale}) => {
  // Provide a fallback for static generation where locale might be missing
  const requestedLocale = locale || routing.defaultLocale;
  
  try {
    return {
      locale: requestedLocale,
      messages: (await import(`../messages/${requestedLocale}.json`)).default
    };
  } catch (error) {
    console.error(`Failed to load messages for locale "${requestedLocale}":`, error);
    throw new Error(`Failed to load messages for locale "${requestedLocale}"`);
  }
});