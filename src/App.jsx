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
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📺 Welcome, {user.name}</h1>
      <button onClick={() => logout({ returnTo: window.location.origin })}>Logout</button>
      <br /><br />
      <input
        type="text"
        placeholder="Add new show..."
        value={newShow}
        onChange={(e) => setNewShow(e.target.value)}
      />
      <button onClick={addShow}>Add</button>

      <input
        type="text"
        placeholder="Search..."
        style={{ marginLeft: '1rem' }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul>
        {shows
          .filter(show => show.toLowerCase().includes(search.toLowerCase()))
          .map((show, index) => (
            <li key={index}>
              {show} <button onClick={() => removeShow(show)}>❌</button>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default function App() {
  return (
    <Auth0Provider
      domain="YOUR_AUTH0_DOMAIN"
      clientId="YOUR_AUTH0_CLIENT_ID"
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <Auth />
    </Auth0Provider>
  )
}

const Auth = () => {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <button onClick={loginWithRedirect}>Login</button>

  return <ProtectedApp />
}