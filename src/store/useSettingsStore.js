import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSettingsStore = create(
  persist(
    (set) => ({
      openRouterApiKey: '',
      openRouterModelId: 'google/gemini-3.1-flash-lite-preview',
      customSystemPrompt: '',
      customTemperature: '',
      setOpenRouterApiKey: (openRouterApiKey) => set({ openRouterApiKey }),
      setOpenRouterModelId: (openRouterModelId) => set({ openRouterModelId }),
      setCustomSystemPrompt: (customSystemPrompt) => set({ customSystemPrompt }),
      setCustomTemperature: (customTemperature) => set({ customTemperature }),
      resetEvaluationSettings: () =>
        set({
          customSystemPrompt: '',
          customTemperature: ''
        })
    }),
    {
      name: 'air-settings'
    }
  )
)
