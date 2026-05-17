import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            loadWishlist();
        } else {
            setWishlistItems([]);
        }
    }, [isAuthenticated]);

    const loadWishlist = async () => {
        try {
            const { data } = await api.fetchWishlist();
            setWishlistItems(data);
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
        }
    };

    const addToWishlist = async (product) => {
        try {
            if (!isAuthenticated) return;
            await api.addToWishlist(product._id);
            setWishlistItems(prev => [...prev, product]);
        } catch (error) {
            console.error("Failed to add to wishlist", error);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            if (!isAuthenticated) return;
            await api.removeFromWishlist(productId);
            setWishlistItems(prev => prev.filter(item => item._id !== productId));
        } catch (error) {
            console.error("Failed to remove from wishlist", error);
        }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item._id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, loadWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
