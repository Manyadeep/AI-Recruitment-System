import { create } from 'zustand'

const useAppStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  sidebarCollapsed: false,
  notifications: [],
  notificationCount: 0,

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },
  clearUser: () => {
    localStorage.removeItem('user')
    set({ user: null })
  },
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setNotifications: (notifications) => set({
    notifications,
    notificationCount: notifications.filter(n => !n.read).length
  }),
}))

export default useAppStore
