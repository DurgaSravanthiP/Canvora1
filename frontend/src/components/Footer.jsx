import React from 'react';
import { Palette, Github, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer 
            className="border-t py-6 mt-auto"
            style={{ backgroundColor: 'var(--footer-bg)', borderTopColor: 'var(--border-color)' }}
        >
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
                            <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>CANVORA</h2>
                        </div>
                        <p className="text-sm italic leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            "Where every brushstroke meets its destiny and every artist finds their vault."
                        </p>
                    </motion.div>

                    {/* Right: Nav and Socials */}
                    <div className="flex flex-col md:flex-row items-center gap-5 md:gap-10">
                        {/* Navigation Links */}
                        <div className="flex items-center gap-6">
                            <Link to="/" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-all" style={{ color: 'var(--text-secondary)' }}>About Us</Link>
                            <Link to="/" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-all" style={{ color: 'var(--text-secondary)' }}>Blog</Link>
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
                                    className="p-2.5 border rounded-lg transition-all hover:bg-white/10"
                                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                                >
                                    <social.icon className="h-4.5 w-4.5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Stripe - Copyright */}
                <div className="pt-4 border-t flex flex-col items-center text-center" style={{ borderTopColor: 'var(--border-color)' }}>
                    <p className="text-sm font-semibold tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                        © 2026 CANVORA. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
