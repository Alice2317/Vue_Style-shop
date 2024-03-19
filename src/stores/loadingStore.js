import { defineStore } from 'pinia'

export default defineStore('loadingStore', {
  state: () => ({
    isLoading: false
  })
})
