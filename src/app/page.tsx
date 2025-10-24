'use client'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/navbar'



export default function Home() {
  const { user, signInWithGooglePopup } = useAuth()

  const handleTalkWithSIA = () => {
    if (user) {
      // User is authenticated, redirect to chat
      window.location.href = '/chat'
    } else {
      // User not authenticated, trigger Google OAuth popup
      signInWithGooglePopup()
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            {/* Hero Section */}
            <div className="mb-12">
              <h1 className="text-5xl font-bold mb-6" style={{ color: '#6683AB' }}>
                Stronger, Calmer. For Life.
              </h1>
              <p className="text-xl mb-8" style={{ color: '#6381A8' }}>
                Welcome to SAMA - The Calm Mind Studio. Your journey to wellness, balance, and tranquility begins here.
              </p>
            </div>



            {/* Chat with SIA Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto mb-8 border border-gray-200">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-blue-500">
                  <span className="text-white font-bold text-xl">SIA</span>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-800">Meet SIA</h2>
                <p className="text-lg text-gray-600">
                  Your gentle AI wellness companion. SIA is here to guide you toward balance, calm, and wellness with patience and encouragement.
                </p>
              </div>

              <button 
                onClick={handleTalkWithSIA}
                className="w-full py-4 px-8 rounded-xl text-white font-semibold text-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 bg-blue-500 hover:bg-blue-600"
              >
                💬 Talk with SIA
              </button>
            </div>



            {/* SAMA Pillars */}
            <div className="grid md:grid-cols-5 gap-4 mb-12">
              {['Strength', 'Balance', 'Mobility', 'Endurance', 'Calm Mind'].map((pillar) => (
                <div key={pillar} className="p-4 rounded-lg shadow-sm" style={{ backgroundColor: '#FFF5EF' }}>
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6683AB' }}>
                    <span className="text-white font-bold">{pillar[0]}</span>
                  </div>
                  <h3 className="font-semibold" style={{ color: '#6381A8' }}>{pillar}</h3>
                </div>
              ))}
            </div>
            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: '#FFF5EF' }}>
                <div className="text-2xl mb-3">🧘‍♀️</div>
                <h3 className="font-semibold mb-2" style={{ color: '#6683AB' }}>Book Trial</h3>
                <p className="text-sm" style={{ color: '#6381A8' }}>Experience our mindful approach</p>
              </div>
              <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: '#FFF5EF' }}>
                <div className="text-2xl mb-3">📋</div>
                <h3 className="font-semibold mb-2" style={{ color: '#6683AB' }}>View Plans</h3>
                <p className="text-sm" style={{ color: '#6381A8' }}>Find your perfect wellness journey</p>
              </div>
              <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: '#FFF5EF' }}>
                <div className="text-2xl mb-3">💡</div>
                <h3 className="font-semibold mb-2" style={{ color: '#6683AB' }}>Wellness Tips</h3>
                <p className="text-sm" style={{ color: '#6381A8' }}>Daily inspiration for balance</p>
              </div>
            </div>
          </div>
      </main>
    </div>
  );
}
