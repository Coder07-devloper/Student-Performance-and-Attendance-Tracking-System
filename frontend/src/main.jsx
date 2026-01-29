/**
 * Main Entry Point
 * 
 * This is where the React app starts. It renders the App component
 * into the root div in index.html
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

