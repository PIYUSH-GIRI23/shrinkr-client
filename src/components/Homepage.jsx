import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleGoogleAuth, handleGoogleRedirect } from '../controller/authController.js'
import { QrCode } from 'lucide-react'

const Stat = ({ label, value, duration = 1200 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const stepTime = Math.max(Math.floor(duration / end), 10)
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / stepTime))
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, stepTime)
    return () => clearInterval(timer)
  }, [value, duration])

  return (
    <div className="flex flex-col items-start">
      <div className="text-3xl sm:text-4xl font-extrabold text-white">{count.toLocaleString()}</div>
      <div className="text-sm text-gray-300">{label}</div>
    </div>
  )
}

const Homepage = () => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const accessToken = localStorage.getItem('shrinkr-accessToken')
    const refreshToken = localStorage.getItem('shrinkr-refreshToken')

    if (accessToken || refreshToken) {
      setIsLoggedIn(true)
      navigate('/dashboard')
      return
    }

    handleGoogleRedirect(navigate)
  }, [navigate])

  const handleAuth = () => {
    const accessToken = localStorage.getItem('shrinkr-accessToken')
    const refreshToken = localStorage.getItem('shrinkr-refreshToken')

    if (accessToken || refreshToken) {
      navigate('/dashboard')
      return
    }

    handleGoogleAuth()
  }

  return (
    <div className="min-h-screen bg-[#071129] text-white antialiased">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-linear-to-tr from-orange-400 to-pink-500 flex items-center justify-center font-bold text-lg">
            U
          </div>
          <div className="text-white font-semibold">Shrinkr</div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-gray-300">
          <button className="px-3 py-2 rounded-md hover:text-white">Features</button>
          <button className="px-3 py-2 rounded-md hover:text-white">Security</button>
          <button className="px-3 py-2 rounded-md hover:text-white">Pricing</button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAuth}
            className="bg-white text-[#071129] px-4 py-2 rounded-full font-semibold hover:scale-105 transform transition cursor-pointer"
          >
            {isLoggedIn ? 'Dashboard' : 'Sign up Free'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-4">
              Smarter, safer and shareable links.
            </h1>
            <p className="text-gray-300 text-lg max-w-xl mb-8">
              With Shrinkr, you don't just shorten URLs — you protect users, track engagement, and
              create QR codes that connect the world effortlessly.
            </p>

            <button
              onClick={handleAuth}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full font-semibold transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              {isLoggedIn ? 'Go to Dashboard →' : "Get Started — It's Free →"}
            </button>

            <div className="mt-12 flex gap-6 items-center">
              <Stat label="Links shortened" value={19423} />
              <Stat label="QRs generated" value={4521} />
              <Stat label="Active users" value={9823} />
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="bg-linear-to-br from-[#071a2a] to-[#052233] p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
              <QrCode className="w-24 h-24 mx-auto text-blue-400 mb-6" />
              <h2 className="text-2xl font-bold mb-2">Instant QR Generator</h2>
              <p className="text-gray-300 text-sm">
                Convert any link into a scannable QR code in seconds — ideal for sharing offline,
                posters, or business cards.
              </p>
              <button
                onClick={handleAuth}
                className="mt-6 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-md font-semibold transition cursor-pointer"
              >
                {isLoggedIn ? 'Go to Dashboard →' : 'Generate Your QR →'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-20">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Preview before visiting',
              desc: 'See where a short link leads — no more phishing or shady redirects.',
            },
            {
              title: 'QR Code ready',
              desc: 'Turn any link into a QR code with one click. Share it anywhere.',
            },
            {
              title: 'Smart link analytics',
              desc: 'Get key stats like clicks, device type, and location instantly.',
            },
          ].map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-[#071827] hover:scale-105 transform transition duration-200"
            >
              <div className="text-xl font-semibold mb-2">{f.title}</div>
              <div className="text-sm text-gray-300">{f.desc}</div>
              <div className="mt-4 text-sm text-indigo-300 cursor-pointer hover:underline">
                Learn more →
              </div>
            </div>
          ))}
        </section>

        <section className="bg-[#061828] p-10 rounded-xl text-center">
          <h2 className="text-3xl font-bold mb-4">Link management made simple</h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Shrinkr gives you total control over your links — edit, delete, or monitor them in one
            powerful dashboard. Whether you're an individual or a business, it's built to scale with
            your needs.
          </p>
          <button
            onClick={handleAuth}
            className="bg-white text-[#071129] px-6 py-3 rounded-full font-semibold hover:scale-105 transition cursor-pointer"
          >
            {isLoggedIn ? 'Go to Dashboard →' : 'Try Shrinkr Today →'}
          </button>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="bg-[#071827] rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-3">Advanced link protection</h3>
            <p className="text-gray-300">
              Every link you share with Shrinkr is automatically scanned for malicious activity. We
              prioritize user safety above all else.
            </p>
          </div>
          <div className="bg-[#071827] rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-3">Custom branding</h3>
            <p className="text-gray-300">
              Make your short links look professional — add your brand name, logo, and custom
              domain. Perfect for businesses and creators.
            </p>
          </div>
        </section>

        <section className="bg-[#061828] p-10 rounded-xl text-center">
          <h2 className="text-3xl font-bold mb-4">Start shortening smarter</h2>
          <p className="text-gray-300 mb-6">
            No credit card required. Get started in seconds with our free plan.
          </p>
          <button
            onClick={handleAuth}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold cursor-pointer"
          >
            {isLoggedIn ? 'Go to Dashboard' : "Sign up — It's free"}
          </button>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Shrinkr — connecting the world, one link at a time.
      </footer>
    </div>
  )
}

export default Homepage
