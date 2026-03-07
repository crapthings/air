import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSettingsStore = create(
  persist(
    (set) => ({
      openRouterApiKey: '',
      openRouterModelId: 'openai/gpt-4.1-mini',
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
