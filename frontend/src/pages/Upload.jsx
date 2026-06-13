import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, Image as ImageIcon, X, Plus } from 'lucide-react';
import * as api from '../api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const Upload = () => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [title, setTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [price, setPrice] = useState('');
    const [availability, setAvailability] = useState(1);
    const [customAvailability, setCustomAvailability] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const categories = ['Painting', 'Abstract', 'Digital', 'Photography', 'Sculpture', 'Mixed Media'];
    const availabilityOptions = [1, 2, 3, 4, 5, 'Other'];

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const id = query.get('edit');
        if (id) {
            setIsEditing(true);
            setEditId(id);
            loadProductData(id);
        }
    }, [location]);

    const loadProductData = async (id) => {
        try {
            const { data } = await api.fetchProduct(id);
            setTitle(data.title);
            setSelectedCategory(data.category);
            setPrice(data.price);
            if ([1, 2, 3, 4, 5].includes(data.copies)) {
                setAvailability(data.copies);
            } else {
                setAvailability('Other');
                setCustomAvailability(data.copies);
            }
            setDescription(data.description);
            setSelectedImages(data.images || []);
        } catch (error) {
            console.error("Failed to load product for editing", error);
            showToast("Failed to load artwork data", "error");
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const handleFiles = (files) => {
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImages(prev => [...prev, e.target.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const productData = {
            title,
            category: selectedCategory,
            price: Number(price),
            copies: availability === 'Other' ? Number(customAvailability) : Number(availability),
            description,
            images: selectedImages // Array of Base64 strings
        };

        try {
            if (isEditing) {
                await api.updateProduct(editId, productData);
            } else {
                await api.createProduct(productData);
            }
            setLoading(false);
            showToast(`${isEditing ? 'Artwork updated' : 'Artwork uploaded'} successfully!`, "success");
            navigate('/collections');
        } catch (error) {
            console.error(error);
            setLoading(false);
            showToast(`Failed to ${isEditing ? 'update' : 'upload'} artwork`, "error");
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <div className="max-w-3xl mx-auto text-center mb-10">
                <h1 className="text-4xl font-bold mb-2">{isEditing ? 'Edit Your Artwork' : 'Upload Your Artwork'}</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Share your masterpiece with collectors worldwide</p>
            </div>

            <div className="max-w-2xl mx-auto backdrop-blur-xl border rounded-3xl p-8 shadow-2xl" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
                <form onSubmit={handleSubmit}>
                    {/* Image Upload Section */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Artwork Image</label>
                        <div
                            className={`relative border-2 border-dashed rounded-2xl p-8 transition-colors ${dragActive ? "border-primary bg-primary/10" : "hover:border-primary/20"
                                }`}
                            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={handleChange}
                                accept="image/*"
                                multiple
                            />

                            {selectedImages.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4 relative z-20">
                                    {selectedImages.map((img, index) => (
                                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden group">
                                            <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeImage(index);
                                                }}
                                                className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500 rounded-full text-white transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <div className="flex flex-col items-center justify-center border rounded-lg hover:bg-white/5 transition-colors cursor-pointer min-h-[100px]" style={{ borderColor: 'var(--border-color)' }}>
                                        <Plus className="h-6 w-6 opacity-40" />
                                        <span className="text-xs opacity-40 mt-1">Add More</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                                        <ImageIcon className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-medium mb-1">Drop your artworks here</h3>
                                    <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>or click to browse from your device</p>
                                    <p className="text-xs opacity-40">PNG, JPG or WEBP (Multiple allowed)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Artwork Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            placeholder="Give your artwork a captivating title"
                            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                            className="w-full border rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>

                    {/* Category */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Category</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${selectedCategory === cat
                                        ? 'bg-primary border-primary text-white font-bold'
                                        : 'hover:bg-primary/10'
                                        }`}
                                    style={{ 
                                        backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-secondary)',
                                        borderColor: selectedCategory === cat ? 'var(--primary)' : 'var(--border-color)',
                                        color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Price (INR)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">Rs. </span>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="0.00"
                                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                    className="w-full border rounded-xl pl-14 pr-4 py-3 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                />
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Available Copies</label>
                                <div className="flex rounded-xl p-1 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                                    {availabilityOptions.map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setAvailability(opt)}
                                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${availability === opt
                                                ? 'bg-primary text-white shadow-lg'
                                                : 'hover:text-primary'
                                                }`}
                                            style={{ color: availability === opt ? '#ffffff' : 'var(--text-secondary)' }}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {availability === 'Other' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <input
                                        type="number"
                                        value={customAvailability}
                                        onChange={(e) => setCustomAvailability(e.target.value)}
                                        placeholder="Enter number of copies"
                                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                        className="w-full border rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    />
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Description</label>
                        <textarea
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell the story behind your artwork..."
                            style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                            className="w-full border rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        <UploadIcon className="h-5 w-5" /> {loading ? (isEditing ? 'Updating...' : 'Uploading...') : (isEditing ? 'Update Artwork' : 'Upload Artwork')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Upload;
