import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'vi' | 'en'

interface LanguageState {
  language: Language
  setLanguage: (lang: Language) => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'vi',
      setLanguage: (language) => set({ language }),
    }),
    { name: 'language-storage' }
  )
)
