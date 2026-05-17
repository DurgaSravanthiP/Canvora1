import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, Calendar, Camera, Edit2,
    Trash2, Heart, Lock, LogOut, Save, X,
    Plus, ShoppingBag, ArrowRight, Shield, Settings,
    Package, MapPin, FileText, Eye
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import * as api from '../api';

const Profile = () => {
    const { user, logout, updateUser } = useAuth();
    const { wishlistItems } = useWishlist();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        location: user?.location || '',
        bio: user?.bio || '',
        profileImage: user?.profileImage || ''
    });

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [artworkToDelete, setArtworkToDelete] = useState(null);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [myArtworks, setMyArtworks] = useState([]);
    const [loadingArt, setLoadingArt] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await api.getMe();
                // Ensure we use the same fields as the login response
                const storedUser = localStorage.getItem('user');
                const token = storedUser ? JSON.parse(storedUser)?.token : null;
                const userWithToken = { ...data, token };
                updateUser(userWithToken);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            }
        };

        fetchUserData();

        if (activeTab === 'artworks') {
            loadMyArtworks();
        }
    }, [activeTab]);

    // Update form data when user context updates
    useEffect(() => {
        if (user && !isEditing && user.name !== undefined) {
            setProfileData({
                name: user.name || '',
                location: user.location || '',
                bio: user.bio || '',
                profileImage: user.profileImage || ''
            });
        }
    }, [user, isEditing]);

    const loadMyArtworks = async () => {
        try {
            setLoadingArt(true);
            const { data } = await api.fetchMyArtworks();
            setMyArtworks(data);
            setLoadingArt(false);
        } catch (error) {
            console.error("Failed to load artworks", error);
            setLoadingArt(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.updateUserProfile(profileData);
            updateUser(data);
            setIsEditing(false);
            showToast("Profile updated successfully!", "success");
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to update profile", "error");
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast("New passwords do not match", "error");
            return;
        }
        try {
            await api.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            showToast("Password changed successfully", "success");
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            showToast(error.response?.data?.message || "Failed to change password", "error");
        }
    };

    const handleDeleteArtwork = (id) => {
        setArtworkToDelete(id);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!artworkToDelete) return;
        try {
            await api.deleteProduct(artworkToDelete);
            setMyArtworks(prev => prev.filter(art => art._id !== artworkToDelete));
            showToast("Artwork removed", "success");
            setShowDeleteConfirm(false);
            setArtworkToDelete(null);
        } catch (error) {
            showToast("Failed to delete artwork", "error");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Image = reader.result;
                // Update local state for immediate feedback
                setProfileData(prev => ({ ...prev, profileImage: base64Image }));

                // If not currently editing other fields, save the image immediately
                if (!isEditing) {
                    try {
                        const { data } = await api.updateUserProfile({
                            ...profileData,
                            profileImage: base64Image
                        });
                        updateUser(data);
                        showToast("Profile photo updated!", "success");
                    } catch (error) {
                        showToast("Failed to save profile photo", "error");
                    }
                } else {
                    showToast("Photo staged. Save details to persist.", "info");
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-80 space-y-4">
                        <div className="bg-surface/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
                            <div className="flex flex-col items-center text-center">
                                <div className="relative group mb-4">
                                    <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-1">
                                        <div className="h-full w-full rounded-full overflow-hidden bg-background">
                                            {profileData.profileImage ? (
                                                <img src={profileData.profileImage} alt="Profile" className="h-full w-full object-cover" />
                                            ) : (
                                                <User className="h-full w-full p-4 text-gray-500" />
                                            )}
                                        </div>
                                    </div>
                                    <label className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg">
                                        <Camera className="h-4 w-4 text-white" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                </div>
                                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                                <p className="text-sm text-gray-400 mb-6">{user?.email}</p>

                                <div className="w-full space-y-2 text-left">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/5'}`}
                                    >
                                        <Settings className="h-5 w-5" /> Profile Settings
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('artworks')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'artworks' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/5'}`}
                                    >
                                        <Package className="h-5 w-5" /> My Artworks
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('security')}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'security' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/5'}`}
                                    >
                                        <Shield className="h-5 w-5" /> Security
                                    </button>
                                </div>

                                <div className="w-full h-px bg-white/10 my-4" />

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-medium"
                                >
                                    <LogOut className="h-5 w-5" /> Sign Out
                                </button>
                            </div>
                        </div>

                        {/* Wishlist Summary Card */}
                        <div className="bg-surface/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 group cursor-pointer" onClick={() => navigate('/wishlist')}>
                            <div className="flex items-center justify-between mb-2">
                                <Heart className="h-6 w-6 text-red-500" />
                                <span className="text-2xl font-bold text-white">{wishlistItems.length}</span>
                            </div>
                            <p className="text-sm text-gray-400">Items in your wishlist</p>
                            <div className="flex items-center gap-2 text-xs text-primary mt-4 group-hover:underline">
                                View all <ArrowRight className="h-3 w-3" />
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-surface/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="text-2xl font-bold text-white">Personal Information</h3>
                                            <button
                                                onClick={() => setIsEditing(!isEditing)}
                                                className="text-primary hover:underline text-sm font-medium flex items-center gap-2"
                                            >
                                                {isEditing ? <><X className="h-4 w-4" /> Cancel</> : <><Edit2 className="h-4 w-4" /> Edit Profile</>}
                                            </button>
                                        </div>

                                        <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Full Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        disabled={!isEditing}
                                                        value={profileData.name}
                                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary disabled:opacity-50"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <input
                                                        type="email"
                                                        disabled={true}
                                                        value={user?.email}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none opacity-50"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Location</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        disabled={!isEditing}
                                                        placeholder="e.g. New York, USA"
                                                        value={profileData.location}
                                                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary disabled:opacity-50"
                                                    />
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Short Bio</label>
                                                <div className="relative">
                                                    <FileText className="absolute left-4 top-6 h-5 w-5 text-gray-400" />
                                                    <textarea
                                                        disabled={!isEditing}
                                                        placeholder="Tell us about yourself..."
                                                        value={profileData.bio}
                                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                                        rows="3"
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary disabled:opacity-50 resize-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Date Joined</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        disabled={true}
                                                        value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none opacity-50"
                                                    />
                                                </div>
                                            </div>

                                            {isEditing && (
                                                <div className="md:col-span-2 pt-4">
                                                    <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                                        <Save className="h-5 w-5" /> Save Updated Details
                                                    </button>
                                                </div>
                                            )}
                                        </form>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'artworks' && (
                                <motion.div
                                    key="artworks"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-2xl font-bold text-white">My Uploaded Artworks</h3>
                                        <Link to="/upload" className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                                            <Plus className="h-4 w-4" /> New Art
                                        </Link>
                                    </div>

                                    {loadingArt ? (
                                        <div className="text-center py-20 text-gray-500">Loading artworks...</div>
                                    ) : myArtworks.length === 0 ? (
                                        <div className="bg-surface/30 border border-white/10 rounded-3xl p-12 text-center">
                                            <ShoppingBag className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                            <p className="text-gray-400">No artworks uploaded yet.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            {myArtworks.map((art) => (
                                                <div key={art._id} className="bg-surface/30 border border-white/10 rounded-2xl overflow-hidden flex flex-col sm:flex-row gap-4 p-4 group relative">
                                                    <Link to={`/product/${art._id}`} className="w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0">
                                                        <img src={art.images[0]} alt={art.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                                                    </Link>
                                                    <div className="flex-1 min-w-0">
                                                        <Link to={`/product/${art._id}`}>
                                                            <h4 className="text-white font-bold truncate hover:text-primary transition-colors">{art.title}</h4>
                                                        </Link>
                                                        <p className="text-xs text-primary mb-2 uppercase">{art.category}</p>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-sm font-bold text-white">Rs. {art.price}</span>
                                                            <span className="text-[10px] text-gray-500">{art.copies} copies</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex sm:flex-col gap-2 justify-center">
                                                        <button
                                                            onClick={() => navigate(`/product/${art._id}`)}
                                                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => navigate(`/upload?edit=${art._id}`)}
                                                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                                                            title="Edit Artwork"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteArtwork(art._id)}
                                                            className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors"
                                                            title="Delete Artwork"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'security' && (
                                <motion.div
                                    key="security"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-surface/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                                        <h3 className="text-2xl font-bold text-white mb-8">Security Settings</h3>

                                        <form onSubmit={handlePasswordChange} className="max-w-md space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Current Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <input
                                                        type="password"
                                                        required
                                                        value={passwordData.currentPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">New Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <input
                                                        type="password"
                                                        required
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Confirm New Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                    <input
                                                        type="password"
                                                        required
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-primary"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>

                                            <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                                                <Lock className="h-5 w-5" /> Change Password
                                            </button>
                                        </form>

                                        <div className="mt-8 pt-8 border-t border-white/10">
                                            <p className="text-sm text-gray-400 mb-4">Forget your password?</p>
                                            <button className="text-primary hover:underline font-medium text-sm">Reset via email address</button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowDeleteConfirm(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-surface border border-white/10 p-8 rounded-3xl max-w-md w-full relative z-10 shadow-2xl text-center"
                        >
                            <div className="h-16 w-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                                <Trash2 className="h-8 w-8 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4 text-white">Delete Artwork?</h2>
                            <p className="text-gray-400 mb-8">
                                Are you sure you want to remove this masterpiece? This action is permanent and cannot be undone.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-3 px-6 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors"
                                >
                                    Keep Art
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-3 px-6 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-500/20"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
