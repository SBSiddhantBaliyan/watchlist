import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Auth0Provider } from '@auth0/auth0-react'

const ProtectedApp = () => {
  const { logout, user } = useAuth0()
  const [shows, setShows] = useState(() =>
    JSON.parse(localStorage.getItem('watchlist')) || []
  )
  const [search, setSearch] = useState('')
  const [newShow, setNewShow] = useState('')

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(shows))
  }, [shows])

  const addShow = () => {
    if (newShow.trim()) {
      setShows([...shows, newShow.trim()])
      setNewShow('')
    }
  }

  const removeShow = (showToRemove) => {
    setShows(shows.filter(show => show !== showToRemove))
  }

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📺 Welcome, {user.name}</h1>
        <button
          onClick={() => logout({ returnTo: window.location.origin })}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Add new show..."
          className="flex-1 p-2 rounded text-black"
          value={newShow}
          onChange={(e) => setNewShow(e.target.value)}
        />
        <button
          onClick={addShow}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        >
          Add
        </button>
      </div>

      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 rounded text-black mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid gap-4">
        {shows
          .filter(show => show.toLowerCase().includes(search.toLowerCase()))
          .map((show, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded shadow flex justify-between items-center"
            >
              <span className="text-lg">{show}</span>
              <button
                onClick={() => removeShow(show)}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
              >
                Remove
              </button>
            </div>
          ))}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Auth0Provider
      domain="dev-xi5zpyfno3r54bh1.us.auth0.com"
      clientId="p7aZZFpIyICG7HPjlGfdz5gKdD9KIP0t"
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <Auth />
    </Auth0Provider>
  )
}

const Auth = () => {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0()

  if (isLoading) return <div className="p-8 text-center">Loading...</div>
  if (!isAuthenticated) return (
    <div className="p-8 text-center">
      <button
        onClick={loginWithRedirect}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
      >
        Login
      </button>
    </div>
  )

  return <ProtectedApp />
}