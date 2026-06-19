// src/hooks/useCart.js
import { useState } from "react";
import { getPrecoItem } from "../utils/helpers";

export function useCart(adicionalGourmet = 0) {
  const [cart,    setCart]    = useState([]);
  const [editIdx, setEditIdx] = useState(null);
  const [addingIt,setAddingIt]= useState(false);

  const cartTotal  = cart.reduce((s, it) => s + (getPrecoItem(it, adicionalGourmet) ?? 0), 0);

  const calcTotals = (taxa = 0) => {
    const cartFinal  = cartTotal + taxa;
    const cartCaucao = Math.ceil(cartFinal * 0.5);
    const cartSaldo  = cartFinal - cartCaucao;
    return { cartFinal, cartCaucao, cartSaldo };
  };

  const addItem = (item) => setCart(p => [...p, item]);

  const updateItem = (idx, item) =>
    setCart(p => p.map((it, i) => i === idx ? item : it));

  const removeItem = (idx) =>
    setCart(p => p.filter((_, i) => i !== idx));

  const resetCart = () => {
    setCart([]);
    setEditIdx(null);
    setAddingIt(false);
  };

  return {
    cart, setCart,
    editIdx, setEditIdx,
    addingIt, setAddingIt,
    cartTotal, calcTotals,
    addItem, updateItem, removeItem, resetCart,
  };
}