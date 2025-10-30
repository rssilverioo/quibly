import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // ✅ Garante que 'locale' nunca é undefined
  const currentLocale = locale ?? 'pt';

  let messages;
  try {
    messages = (await import(`./src/app/messages/${currentLocale}.json`)).default;
  } catch {
    // fallback de segurança caso não exista o arquivo do idioma
    messages = (await import(`./src/app/messages/pt.json`)).default;
  }

  return {
    locale: currentLocale,
    messages,
  };
});
