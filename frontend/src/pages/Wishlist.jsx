import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist } = useWishlist();

    return (
        <div className="min-h-screen bg-transparent pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
                <p className="text-gray-400 mb-8">Save your favorite pieces for later.</p>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-20 bg-surface/30 rounded-2xl border border-white/5">
                        <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-300 mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 mb-6">Explore our collections and find something you love.</p>
                        <Link to="/collections" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors">
                            Browse Collections <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {wishlistItems.map((item) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-surface rounded-2xl overflow-hidden border border-white/5 group relative"
                            >
                                <div className="relative aspect-[4/5] bg-gray-800 overflow-hidden">
                                    <div className="absolute top-4 right-4 z-30">
                                        <button
                                            onClick={() => removeFromWishlist(item._id)}
                                            className="p-2 bg-red-500/20 backdrop-blur-md rounded-full hover:bg-red-500/40 transition-colors text-red-500"
                                        >
                                            <Heart className="h-4 w-4 fill-current" />
                                        </button>
                                    </div>

                                    {/* Fallback visual if image breaks or is base64 */}
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center overflow-hidden">
                                        {item.images && item.images.length > 0 ? (
                                            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-4xl text-white/10 font-bold">ART</span>
                                        )}
                                    </div>

                                    <Link to={`/product/${item._id}`} className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                                        <button className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
                                            <ShoppingBag className="h-4 w-4" /> View Details
                                        </button>
                                    </Link>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-bold text-white truncate mb-1">{item.title}</h3>
                                    <p className="text-sm text-gray-400 mb-3">Owner: {item.artist?.name || 'Unknown'}</p>
                                    <div className="flex justify-between items-center border-t border-white/5 pt-3">
                                        <p className="font-bold text-white">Rs. {item.price}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
