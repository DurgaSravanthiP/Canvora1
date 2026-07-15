import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, X, ArrowUpRight, ArrowDownLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRequests } from '../context/RequestContext';
import * as api from '../api';

const Requests = () => {
    const [activeTab, setActiveTab] = useState('incoming');
    const [showConfirm, setShowConfirm] = useState(false);
    const [requestToCancel, setRequestToCancel] = useState(null);
    const { incomingRequests, outgoingRequests, fetchUserRequests } = useRequests();

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.updateRequestStatus(id, status);
            fetchUserRequests();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleCancelRequest = (id) => {
        setRequestToCancel(id);
        setShowConfirm(true);
    };

    const confirmCancel = async () => {
        if (!requestToCancel) return;
        try {
            await api.cancelRequest(requestToCancel);
            fetchUserRequests();
            setShowConfirm(false);
            setRequestToCancel(null);
        } catch (error) {
            console.error("Failed to cancel request", error);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Requests & Offers</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Manage your art requests and offers.</p>
                    </div>

                    <div className="flex backdrop-blur-md p-1 rounded-xl border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                        <button
                            onClick={() => setActiveTab('incoming')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'incoming'
                                ? 'bg-primary text-white shadow-lg font-bold'
                                : 'hover:text-primary'
                                }`}
                            style={{ color: activeTab === 'incoming' ? '#ffffff' : 'var(--text-secondary)' }}
                        >
                            Incoming <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded text-xs">{incomingRequests.length}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('outgoing')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'outgoing'
                                ? 'bg-primary text-white shadow-lg font-bold'
                                : 'hover:text-primary'
                                }`}
                            style={{ color: activeTab === 'outgoing' ? '#ffffff' : 'var(--text-secondary)' }}
                        >
                            Outgoing <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded text-xs">{outgoingRequests.length}</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {activeTab === 'incoming' ? (
                        <>
                            {incomingRequests.length === 0 ? (
                                <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>No incoming requests yet.</div>
                            ) : incomingRequests.map((req) => (
                                <motion.div
                                    key={req._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="backdrop-blur-md border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-primary/30 transition-colors"
                                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                                >
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="h-16 w-16 rounded-lg flex-shrink-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 overflow-hidden relative" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                            {req.product?.images && req.product.images.length > 0 ? (
                                                <img src={req.product.images[0]} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-xs opacity-20 font-bold">IMG</div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{req.product?.title || "Unknown Art"}</h3>
                                            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                <ArrowDownLeft className="h-4 w-4 text-green-400" />
                                                <span>Offer from <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{req.requester?.name || "Unknown"}</span></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                        <div className="text-right">
                                            <p className="text-2xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>Rs. {req.price}</p>
                                            <p className="text-xs flex items-center justify-end gap-1" style={{ color: 'var(--text-secondary)' }}>
                                                <Clock className="h-3 w-3" /> {new Date(req.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            {req.status === 'pending' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(req._id, 'accepted')}
                                                        className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-500 rounded-lg border border-green-500/50 transition-colors"
                                                        title="Accept"
                                                    >
                                                        <Check className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(req._id, 'rejected')}
                                                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg border border-red-500/50 transition-colors"
                                                        title="Decline"
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                </>
                                            ) : (
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${req.status === 'accepted' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
                                                    }`}>
                                                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </>
                    ) : (
                        <>
                            {outgoingRequests.length === 0 ? (
                                <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>No outgoing requests send.</div>
                            ) : outgoingRequests.map((req) => (
                                <motion.div
                                    key={req._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="backdrop-blur-md border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-primary/30 transition-colors"
                                    style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                                >
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="h-16 w-16 rounded-lg flex-shrink-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 overflow-hidden relative" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                            {req.product?.images && req.product.images.length > 0 ? (
                                                <img src={req.product.images[0]} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-xs opacity-20 font-bold">IMG</div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{req.product?.title || "Unknown Art"}</h3>
                                            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                <ArrowUpRight className="h-4 w-4 text-primary" />
                                                <span>Request to <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{req.artist?.name || "Artist"}</span></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                        <div className="text-right">
                                            <p className="text-2xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>Rs. {req.price}</p>
                                            <p className="text-xs flex items-center justify-end gap-1" style={{ color: 'var(--text-secondary)' }}>
                                                <Clock className="h-3 w-3" /> {new Date(req.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${req.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
                                                req.status === 'accepted' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                                    'border-white/10'
                                                }`}
                                                style={{ color: (req.status !== 'pending' && req.status !== 'accepted') ? 'var(--text-secondary)' : undefined }}
                                            >
                                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                            </span>
                                            {req.status === 'pending' && (
                                                <button
                                                    onClick={() => handleCancelRequest(req._id)}
                                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg border border-red-500/20 transition-colors"
                                                    title="Cancel Request"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            <div className="flex justify-center mt-8">
                                <Link to="/collections" className="flex items-center gap-2 text-primary hover:text-primary transition-colors font-bold">
                                    <Send className="h-4 w-4" /> Send New Request
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="border p-8 rounded-3xl max-w-md w-full relative z-10 shadow-2xl text-center"
                        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
                    >
                        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Cancel Request?</h2>
                        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
                            Are you sure you want to cancel this purchase request? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-3 px-6 rounded-xl font-bold transition-colors"
                                style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                            >
                                No, Keep it
                            </button>
                            <button
                                onClick={confirmCancel}
                                className="flex-1 py-3 px-6 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors"
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Requests;
