import { create } from 'zustand'; 

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("talksphere-theme") || "coffee", 
    setTheme: (theme) => {
        localStorage.setItem("talksphere-theme", theme),     
        set({ theme })
    }, 
}))