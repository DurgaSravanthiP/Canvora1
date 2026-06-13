import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, ShoppingBag, ArrowLeft, Mail } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useRequests } from '../context/RequestContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as api from '../api';

const ProductDetails = () => {
    const { id } = useParams();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { outgoingRequests, fetchUserRequests } = useRequests();
    const { user: currentUser } = useAuth();
    const { showToast } = useToast();
    const [requestSent, setRequestSent] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const { data } = await api.fetchProduct(id);
                setProduct(data);
                const reviewResponse = await api.fetchReviews(id);
                setReviews(reviewResponse.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch product", error);
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    const isLiked = product ? isInWishlist(product._id) : false;
    const isOwner = product && currentUser && product.artist?._id === currentUser._id;
    const hasExistingRequest = product ? outgoingRequests.some(req => req.product?._id === product._id) : false;
    const remainingCopies = product ? (product.copies - (product.soldCount || 0)) : 0;
    const isOutOfStock = remainingCopies <= 0;

    const handleSendRequest = async () => {
        if (!product) return;
        setShowConfirm(true);
    };

    const confirmRequest = async () => {
        try {
            await api.createRequest({
                productId: product._id,
                artistId: product.artist._id,
                price: product.price,
                message: "I am interested in purchasing this artwork."
            });
            await fetchUserRequests();
            setRequestSent(true);
            setShowConfirm(false);
            showToast("Purchase request sent!", "success");
        } catch (error) {
            showToast("Failed to send request", "error");
            setShowConfirm(false);
        }
    };

    if (loading) return <div className="text-center pt-32" style={{ color: 'var(--text-primary)' }}>Loading...</div>;
    if (!product) return <div className="text-center pt-32" style={{ color: 'var(--text-primary)' }}>Product not found</div>;

    const toggleWishlist = () => {
        if (isLiked) removeFromWishlist(product._id);
        else addToWishlist(product);
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `CANVORA | ${product.title}`,
                    text: `Check out this amazing artwork: ${product.title}`,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                showToast("Link copied to clipboard!", "success");
            }
        } catch (error) {
            if (error.name !== 'AbortError') console.error("Error sharing:", error);
        }
    };

    const handleReviewSubmit = async () => {
        try {
            const { data } = await api.addReview(id, { rating, comment });
            setReviews(data);
            setRating(0);
            setComment('');
            showToast('Review added successfully!', 'success');
        } catch (error) {
            showToast('Failed to add review', 'error');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/collections" className="inline-flex items-center mb-8 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Collections
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <div className="aspect-[4/5] rounded-2xl overflow-hidden border relative group" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                            <div className="w-full h-full flex items-center justify-center overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                    <img src={product.images[activeImageIndex]} alt={product.title} className="w-full h-full object-cover transition-all duration-500" />
                                ) : (
                                    <span className="text-6xl font-thin opacity-20">ART</span>
                                )}
                            </div>
                            <button onClick={handleShare} className="absolute top-4 right-4 p-3 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors">
                                <Share2 className="h-5 w-5" />
                            </button>
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img, i) => (
                                    <div key={i} onClick={() => setActiveImageIndex(i)} className={`aspect-square rounded-xl border cursor-pointer transition-all overflow-hidden ${activeImageIndex === i ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/50'}`} style={{ borderColor: activeImageIndex === i ? 'var(--primary)' : 'var(--border-color)' }}>
                                        <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col h-full">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className={`flex items-center gap-2 px-3 py-1 border rounded-full ${isOutOfStock ? 'bg-red-500/10 border-red-500/20' : 'bg-primary/10 border-primary/20'}`}>
                                    {!isOutOfStock && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                                    <span className={`text-xs font-semibold uppercase tracking-wider ${isOutOfStock ? 'text-red-500' : 'text-primary'}`}>
                                        {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                                    </span>
                                </div>
                                <span style={{ color: 'var(--text-secondary)' }} className="text-sm">{product.category}</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{product.title}</h1>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="h-10 w-10 bg-gradient-to-tr from-primary to-secondary rounded-full" />
                                    <div>
                                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Owner</p>
                                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{product.artist?.name || 'Unknown User'}</span>
                                        <p className="text-xs text-primary mt-0.5">{product.artist?.email}</p>
                                    </div>
                                </div>
                                {!isOwner && (
                                    <a href={`mailto:${product.artist?.email}`} className="flex items-center gap-2 text-sm bg-black/5 hover:bg-black/10 px-3 py-1.5 rounded-lg transition-colors border" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}>
                                        <Mail className="h-4 w-4" /> Contact Owner
                                    </a>
                                )}
                            </div>

                            <div className="border rounded-2xl p-6 mb-8" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text-secondary)' }}>Description</h3>
                                <p style={{ color: 'var(--text-primary)' }} className="leading-relaxed">{product.description}</p>
                            </div>

                            <div className="border rounded-2xl p-6 mb-8" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-4" style={{ color: 'var(--text-secondary)' }}>Reviews & Ratings</h3>
                                <div className="flex gap-2 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} onClick={() => setRating(star)} className={`text-3xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                                    ))}
                                </div>
                                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your review..." className="w-full p-3 rounded-lg border mb-4" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                                <button onClick={handleReviewSubmit} className="bg-primary px-5 py-2 rounded-lg text-white font-semibold hover:bg-primary/90 transition-colors">Submit Review</button>
                                <div className="mt-6 space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review._id} className="border rounded-xl p-4" style={{ borderColor: 'var(--border-color)' }}>
                                            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{review.user?.name || 'User'}</p>
                                            <p className="text-yellow-400">{'★'.repeat(review.rating)}</p>
                                            <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t" style={{ borderTopColor: 'var(--border-color)' }}>
                            <div className="flex items-end justify-between mb-6">
                                <div>
                                    <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Current Price</p>
                                    <p className="text-4xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>Rs. {product.price}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleSendRequest}
                                    disabled={isOwner || hasExistingRequest || requestSent || isOutOfStock}
                                    className={`flex-1 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${isOwner || hasExistingRequest || requestSent || isOutOfStock
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-primary text-white hover:bg-primary/90'
                                        }`}
                                >
                                    <ShoppingBag className="h-5 w-5" />
                                    {isOwner ? "Your Artwork" : (isOutOfStock ? "Out of Stock" : (hasExistingRequest || requestSent ? "Request Sent!" : "Send Request"))}
                                </button>
                                {!isOwner && (
                                    <button onClick={toggleWishlist} className={`px-6 py-4 border rounded-xl hover:bg-gray-100 transition-colors ${isLiked ? 'text-red-500' : ''}`} style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                                        <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
                    <div className="border p-8 rounded-3xl max-w-md w-full relative z-10 shadow-2xl text-center" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Send Purchase Request?</h2>
                        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
                            Are you sure you want to send a purchase request for <span className="font-medium" style={{ color: 'var(--text-primary)' }}>"{product.title}"</span>?
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 px-6 rounded-xl font-bold transition-colors" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Cancel</button>
                            <button onClick={confirmRequest} className="flex-1 py-3 px-6 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-colors">Send Now</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
