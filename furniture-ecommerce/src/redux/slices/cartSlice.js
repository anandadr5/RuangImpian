import { createSlice } from "@reduxjs/toolkit";

// Menentukan initialState yang berisi struktur data awal untuk cart
const initialState = {
  cartItems: [], // Menyimpan item-item dalam keranjang
  totalAmount: 0, // Menyimpan total harga keseluruhan dalam keranjang
  totalQuantity: 0, // Menyimpan total jumlah item dalam keranjang
  checkoutHistory: [], // Menyimpan riwayat produk yang telah di checkout
};

// Membuat slice (potongan) Redux dengan nama "cart" dan initialState yang telah ditentukan
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Action "addItem" untuk menambahkan item ke keranjang
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id
      );

      // Menambahkan jumlah total item dalam keranjang
      state.totalQuantity++;

      if (!existingItem) {
        // Jika item belum ada dalam keranjang, tambahkan item tersebut
        state.cartItems.push({
          id: newItem.id,
          productName: newItem.productName,
          image: newItem.imgUrl,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
        });
      } else {
        // Jika item sudah ada dalam keranjang, tingkatkan jumlah dan total harga
        existingItem.quantity++;
        existingItem.totalPrice =
          Number(existingItem.totalPrice) + Number(newItem.price);
      }

      // Menghitung total harga keseluruhan dalam keranjang
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity)
      );
    },

    // Action "removeItem" untuk menghapus item dari keranjang berdasarkan ID
    removeItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        // Menghapus item dari keranjang dan mengurangi total jumlah item
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
        state.totalQuantity = state.totalQuantity - existingItem.quantity;
      }

      // Menghitung total harga keseluruhan dalam keranjang setelah menghapus item
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );
    },

    // Action "updateQuantity" untuk memperbarui jumlah item dalam keranjang
    updateQuantity: (state, action) => {
      const { productId, newQuantity } = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === productId
      );

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity; // Mengurangi total jumlah item yang ada di keranjang sebelum memperbarui

        // Memperbarui jumlah dan total harga item yang diubah
        existingItem.quantity = newQuantity;
        existingItem.totalPrice = existingItem.price * newQuantity;

        state.totalQuantity += newQuantity; // Menambah total jumlah item setelah memperbarui
      }

      // Menghitung total harga keseluruhan dalam keranjang setelah memperbarui jumlah item
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + item.totalPrice
      );
    },

    // Action "emptyCart" untuk menghapus semua item dari keranjang setelah melakukan checkout
    emptyCart: (state) => {
      state.checkoutHistory = state.checkoutHistory.concat(state.cartItems);
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

// Menyediakan aksi yang telah didefinisikan dalam slice sebagai "cartActions"
export const cartActions = cartSlice.actions;

export default cartSlice.reducer;
