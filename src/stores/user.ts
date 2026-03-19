import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: '1',
    userName: '管理员',
    userAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    roles: ['admin'],
    permissions: ['read', 'write', 'delete']
  }),
  getters: {
    isAdmin: (state) => state.roles.includes('admin')
  },
  actions: {
    updateUserInfo(info: { userName?: string; userAvatar?: string }) {
      this.userName = info.userName || this.userName
      this.userAvatar = info.userAvatar || this.userAvatar
    },
    logout() {
      this.userId = ''
      this.userName = ''
      this.userAvatar = ''
      this.roles = []
      this.permissions = []
    }
  }
})