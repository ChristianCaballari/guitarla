import { db } from "../data/db";
import { CartItem, Guitar } from "../types";

/* Declaracion de funciones */
export type CartActions =
  | { type: "add-to-cart"; payload: { item: Guitar } }
  | { type: "remove-from-cart"; payload: { id: Guitar["id"] } }
  | { type: "decrease-quantity"; payload: { id: Guitar["id"] } }
  | { type: "increase-quantity"; payload: { id: Guitar["id"] } }
  | { type: "clear-cart" };

export interface CartState {
  data: Guitar[];
  cart: CartItem[];
}

const initialCart = (): CartItem[] => {
  const localStorageCart = localStorage.getItem("cart");
  return localStorageCart ? JSON.parse(localStorageCart) : [];
};

export const initialState = {
  data: db,
  cart: initialCart(),
};

const MIN_ITEMS = 1;
const MAX_ITEMS = 5;

export const cartReducer = (
  state: CartState = initialState,
  action: CartActions
) => {
  switch (action.type) {
    case "add-to-cart":
      const itemExists = state.cart.find(
        (guitar) => guitar.id === action.payload.item.id
      );

      let updatedCart: CartItem[] = [];

      if (itemExists) {
        updatedCart = state.cart.map((item) => {
          if (item.id === action.payload.item.id) {
            if (item.quantity < MAX_ITEMS) {
              return { ...item, quantity: item.quantity + 1 };
            } else {
              return item;
            }
          } else {
            return item;
          }
        });
      } else {
        const newItem: CartItem = { ...action.payload.item, quantity: 1 };
        updatedCart = [...state.cart, newItem];
      }
      return {
        ...state,
        cart: updatedCart,
      };

    case "remove-from-cart":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload.id),
      };

    case "decrease-quantity":
      const updatedCartDecrease = state.cart.map((item) => {
        if (item.id === action.payload.id && item.quantity > MIN_ITEMS) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        return item;
      });
      return {
        ...state,
        cart: updatedCartDecrease, // Asegúrate de asignar el nuevo array al cart
      };

    case "increase-quantity":
      const updatedCartIncrease = state.cart.map((item) => {
        if (item.id === action.payload.id && item.quantity < MAX_ITEMS) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
      return {
        ...state,
        cart: updatedCartIncrease, // Asegúrate de asignar el nuevo array al cart
      };

    case "clear-cart":
      return {
        ...state,
        cart: [],
      };

    default:
      return state;
  }
};
