import React from 'react'
import ReactDOM from 'react-dom/client'
import App from 'app'
import 'styles/index.less'
import { QueryClientProvider } from 'react-query'
import { queryClient } from 'utils/client'
import { LanguageProvider } from 'hooks/use-language'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from 'hooks/use-auth'
import { UserDataProvider } from 'use-user-data'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <UserDataProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <LanguageProvider>
              <App />
            </LanguageProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </UserDataProvider>
    </AuthProvider>
  </React.StrictMode>,
)
