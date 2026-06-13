import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as api from '../api';

const MyArtworks = () => {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMyArtworks = async () => {
            try {
                const { data } = await api.fetchMyArtworks();
                setArtworks(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch my artworks", error);
                setLoading(false);
            }
        };
        loadMyArtworks();
    }, []);

    return (
        <div className="min-h-screen pt-32 pb-20 px-4" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">My Artworks</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Manage the masterpieces you've shared with the world.</p>
                    </div>
                    <Link
                        to="/upload"
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
                    >
                        <Plus className="h-5 w-5" /> Upload New Art
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-20" style={{ color: 'var(--text-secondary)' }}>Loading CANVORA...</div>
                ) : artworks.length === 0 ? (
                    <div className="text-center py-20 rounded-3xl border backdrop-blur-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                        <ShoppingBag className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
                        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>You haven't uploaded any art yet</h3>
                        <p className="mb-8 max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>Start your journey as an artist by sharing your first masterpiece with our community.</p>
                        <Link to="/upload" className="inline-flex bg-primary text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
                            Upload Now
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {artworks.map((art) => (
                            <motion.div
                                key={art._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="rounded-2xl overflow-hidden border group relative"
                                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                            >
                                <div className="relative aspect-[4/5] bg-gray-800 overflow-hidden">
                                    {art.images && art.images.length > 0 ? (
                                        <img src={art.images[0]} alt={art.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                                            <span className="text-4xl text-white/10 font-bold">ART</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                        <Link
                                            to={`/product/${art._id}`}
                                            className="p-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
                                            title="View Details"
                                        >
                                            <ShoppingBag className="h-5 w-5" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold truncate pr-2" style={{ color: 'var(--text-primary)' }}>{art.title}</h3>
                                        <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                                            {art.category}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t" style={{ borderTopColor: 'var(--border-color)' }}>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--text-secondary)' }}>Price</p>
                                            <p className="font-bold font-mono" style={{ color: 'var(--text-primary)' }}>Rs. {art.price}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--text-secondary)' }}>Copies</p>
                                            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{art.copies}</p>
                                        </div>
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

export default MyArtworks;
