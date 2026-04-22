import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "../models/product";

interface FavoritesContextType {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
  loadFavorites: (userId: string) => void;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const getKey = () => {
    const user = localStorage.getItem("currentUser");
    const parsed = user ? JSON.parse(user) : null;
    return parsed ? `favorites_${parsed.id}` : null;
  };

  const [favorites, setFavorites] = useState<Product[]>(() => {
    const key = getKey();
    if (!key) return [];
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const key = getKey();
    if (key) localStorage.setItem(key, JSON.stringify(favorites));
  }, [favorites]);

  const loadFavorites = (userId: string) => {
    const saved = localStorage.getItem(`favorites_${userId}`);
    setFavorites(saved ? JSON.parse(saved) : []);
  };

  const clearFavorites = () => setFavorites([]);

  const toggleFavorite = (product: Product) => {
    setFavorites(prev =>
      prev.find(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  };

  const isFavorite = (productId: number) => favorites.some(p => p.id === productId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, loadFavorites, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
};
