import { defineStore } from 'pinia'
import axios from 'axios'

export default defineStore('cartStore', {
  state: () => ({
    finalTotal: 0,
    total: 0,
    carts: null,
    cartsLength: 0
  }),
  actions: {
    getCarts () {
      this.cartsLength = 0
      const api = `${import.meta.env.VITE_MAIN_URL}/v2/api/${import.meta.env.VITE_MAIN_NAME
        }/cart`
      axios
        .get(api)
        .then((res) => {
          if (res.data.success) {
            this.finalTotal = res.data.data.final_total
            this.total = res.data.data.total
            this.carts = res.data.data.carts
            this.carts.forEach((item) => {
              this.cartsLength += item.qty
            })
          }
        })
        .catch((error) => console.error('cartView-getCarts出錯', error))
    }
  }
})
