import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../reddux/cart/cartslicer'

export default configureStore({
  reducer: {
    counter: counterReducer
  }
})