import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'

createRoot(document.getElementById('root')).render(
  <Auth0Provider
      domain="dev-77ek3utbm2otlnh3.us.auth0.com"
      clientId="3vS2fbxN37S42VG7COEM0By8Q66Uw0on"
      authorizationParams={{
        audience: "https://dev-77ek3utbm2otlnh3.us.auth0.com/api/v2/",
        redirect_uri: window.location.origin
      }}
    >
    <App />
  </Auth0Provider>,
)
