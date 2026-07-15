import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy loading components for performance
const Home = lazy(() => import('./pages/Home'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Auth = lazy(() => import('./pages/Auth'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Requests = lazy(() => import('./pages/Requests'));
const Upload = lazy(() => import('./pages/Upload'));
const MyArtworks = lazy(() => import('./pages/MyArtworks'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

import ProtectedRoute from './components/ProtectedRoute';

// Sleek Loading Component
const PageLoading = () => (
    <div 
        className="fixed inset-0 z-[1000] flex flex-col items-center justify-center backdrop-blur-xl"
        style={{ backgroundColor: 'var(--bg-primary)', opacity: 0.9 }}
    >
        <div className="h-1 w-48 rounded-full overflow-hidden relative" style={{ backgroundColor: 'var(--border-color)' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary animate-progress" />
        </div>
        <p className="mt-4 text-xs font-black uppercase tracking-[0.3em] animate-pulse" style={{ color: 'var(--text-secondary)' }}>Loading CANVORA</p>
    </div>
);




function App() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/auth';

    return (
        <div 
            className="min-h-screen selection:bg-primary selection:text-white flex flex-col transition-colors duration-300"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
        >
            {!isAuthPage && <Navbar />}

            <main className="flex-grow">
                <Suspense fallback={<PageLoading />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth" element={<Auth />} />

                        {/* Protected Routes */}
                        <Route path="/collections" element={
                            <ProtectedRoute>
                                <Marketplace />
                            </ProtectedRoute>
                        } />
                        <Route path="/product/:id" element={
                            <ProtectedRoute>
                                <ProductDetails />
                            </ProtectedRoute>
                        } />
                        <Route path="/upload" element={
                            <ProtectedRoute>
                                <Upload />
                            </ProtectedRoute>
                        } />

                        <Route path="/requests" element={
                            <ProtectedRoute>
                                <Requests />
                            </ProtectedRoute>
                        } />
                        <Route path="/wishlist" element={
                            <ProtectedRoute>
                                <Wishlist />
                            </ProtectedRoute>
                        } />
                        <Route path="/myartworks" element={
                            <ProtectedRoute>
                                <MyArtworks />
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />

                        <Route path="*" element={<NotFound />} />
                        
                    </Routes>
                </Suspense>
            </main>

            {!isAuthPage && <Footer />}
        </div>
    );
}

export default App;
