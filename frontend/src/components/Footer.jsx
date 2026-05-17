import React from 'react';
import { Palette, Github, Instagram, Facebook } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
    const location = useLocation();

    // Show footer on all pages
    // if (location.pathname !== '/') return null;

    return (
        <footer className="bg-background border-t border-white/5 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
                    {/* Left: Brand & Tagline */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col items-center md:items-start text-center md:text-left max-w-sm"
                    >
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="h-8 w-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center">
                                <Palette className="h-5 w-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight">CANVORA</h2>
                        </div>
                        <p className="text-sm text-gray-500 italic leading-relaxed">
                            "Where every brushstroke meets its destiny and every artist finds their vault."
                        </p>
                    </motion.div>

                    {/* Right: Nav and Socials */}
                    <div className="flex flex-col md:flex-row items-center gap-5 md:gap-10">
                        {/* Navigation Links */}
                        <div className="flex items-center gap-6">
                            <Link to="/about" className="text-sm font-bold text-gray-400 hover:text-primary transition-all uppercase tracking-widest">About Us</Link>
                            <Link to="/blog" className="text-sm font-bold text-gray-400 hover:text-primary transition-all uppercase tracking-widest">Blog</Link>
                        </div>

                        {/* Social Media Icons */}
                        <div className="flex items-center gap-3">
                            {[
                                { icon: Instagram, link: 'https://instagram.com', color: 'hover:text-pink-500' },
                                { icon: Facebook, link: 'https://facebook.com', color: 'hover:text-blue-500' },
                                { icon: Github, link: 'https://github.com', color: 'hover:text-white' }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 transition-all hover:bg-white/10 ${social.color}`}
                                >
                                    <social.icon className="h-4.5 w-4.5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Stripe - Copyright */}
                <div className="pt-4 border-t border-white/5 flex flex-col items-center text-center">
                    <p className="text-gray-400 text-sm font-semibold tracking-wide">
                        © 2026 CANVORA. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
