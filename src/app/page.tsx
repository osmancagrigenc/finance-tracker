import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Kişisel Finans Takip
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Finansal hayatınızı kontrol altına alın
          </p>
          <div className="space-x-4">
            <Link
              href="/auth/login"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Giriş Yap
            </Link>
            <Link
              href="/auth/register"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Kayıt Ol
            </Link>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Gelir ve Gider Takibi
            </h3>
            <p className="text-gray-600">
              Tüm gelir ve giderlerinizi kategorize edin, analiz edin ve bütçenizi kontrol altında tutun.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Çoklu Hesap Yönetimi
            </h3>
            <p className="text-gray-600">
              Nakit, banka, kredi kartı ve yatırım hesaplarınızı tek bir yerden yönetin.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Otomatik Maaş Takibi
            </h3>
            <p className="text-gray-600">
              Maaş ödemelerinizi otomatik olarak takip edin ve değişiklikleri kolayca yönetin.
            </p>
          </div>
        </div>

        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Hemen Başlayın
          </h2>
          <p className="text-gray-600 mb-8">
            Finansal hedeflerinize ulaşmak için ilk adımı atın.
          </p>
          <Link
            href="/auth/register"
            className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Ücretsiz Hesap Oluştur
          </Link>
        </section>
      </div>
    </div>
  )
}
