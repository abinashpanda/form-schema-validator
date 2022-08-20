import React from 'react'
import ReactDOM from 'react-dom/client'
import App from 'app'
import 'styles/index.less'
import { QueryClientProvider } from 'react-query'
import { queryClient } from 'utils/client'
import { LanguageProvider } from 'hooks/use-language'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
