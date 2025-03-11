import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('common');
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold text-green-600 mb-8">
        {t('welcome')}
      </h1>
      <p className="text-xl text-center max-w-2xl mb-8">
        {t('description')}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-green-600">{t('features.courses')}</h2>
          <p>{t('features.coursesDescription')}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-green-600">{t('features.grades')}</h2>
          <p>{t('features.gradesDescription')}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-green-600">{t('features.certificates')}</h2>
          <p>{t('features.certificatesDescription')}</p>
        </div>
      </div>
    </main>
  );
}
