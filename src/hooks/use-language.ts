import constate from 'constate'
import { useState } from 'react'

function useLanguage() {
  const [language, setLanguage] = useState<'hindi' | 'english'>('english')

  return {
    language,
    setLanguage,
  }
}

export const [LanguageProvider, useLanguageContext] = constate(useLanguage)
