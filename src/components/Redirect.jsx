import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getFullUrl } from '../controller/linkController.js'
import { Loader, Link2Off } from 'lucide-react'

const Redirect = () => {
  const { shortCode } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const response = await getFullUrl(shortCode)
        if (response?.ok === false || !response?.longUrl) {
          throw new Error('Invalid shortCode')
        }
        window.location.href = response.longUrl
      } catch (err) {
        console.error('Redirect error:', err)
        setError('Link not found or expired')
      } finally {
        setLoading(false)
      }
    }
    fetchUrl()
  }, [shortCode])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071129] flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader className="text-blue-400 animate-pulse" size={36} />
            </div>
          </div>
          <h2 className="mt-6 text-xl font-semibold text-gray-200">
            Redirecting to your destination...
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Please wait while we fetch the original link.
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#071129] flex flex-col items-center justify-center text-white text-center">
        <div className="bg-[#0b2030] p-8 rounded-2xl border border-gray-700 shadow-lg">
          <Link2Off size={60} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-400 mb-2">Link Not Found</h1>
          <p className="text-gray-400 mb-4">
            The link you’re trying to reach doesn’t exist or has expired.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  return null
}

export default Redirect
