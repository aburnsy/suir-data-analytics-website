export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Suir Data Analytics',
  description: 'Business automation, custom software, data analytics, and AI solutions for SMEs in Tipperary, Kilkenny & Laois.',
  email: 'andy@suirda.ie',
  telephone: '+353870910661',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '6 Leighton Manor, Two Mile Borris',
    addressLocality: 'Two Mile Borris',
    addressRegion: 'Co. Tipperary',
    addressCountry: 'IE',
  },
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'County Tipperary' },
    { '@type': 'AdministrativeArea', name: 'County Kilkenny' },
    { '@type': 'AdministrativeArea', name: 'County Laois' },
  ],
  url: 'https://www.suirda.ie',
};

export function serviceSchema(name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: localBusinessSchema,
    areaServed: localBusinessSchema.areaServed,
    url,
  };
}

export function articleSchema(
  title: string,
  description: string,
  url: string,
  datePublished: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished,
    author: {
      '@type': 'Person',
      name: 'Andy Burns',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Suir Data Analytics',
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
