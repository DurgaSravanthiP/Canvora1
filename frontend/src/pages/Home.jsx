import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            {/* Avant-Garde Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: "circOut" }}
                            className="lg:col-span-7"
                        >
                            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-8">
                                <span className="block" style={{ color: 'var(--text-primary)' }}>Beyond</span>
                                <span className="block text-primary italic ml-12 md:ml-24">The</span>
                                <span className="block ml-6 md:ml-12 border-b-8 border-secondary pb-4" style={{ color: 'var(--text-primary)' }}>Canvas</span>
                            </h1>
                            <p className="text-xl md:text-2xl max-w-lg font-medium leading-relaxed mb-12 ml-6 md:ml-12" style={{ color: 'var(--text-secondary)' }}>
                                Where standard boundaries dissolve. Experience a curated digital dimension for the avant-garde collector.
                            </p>
                            <div className="ml-6 md:ml-12 flex gap-8 items-center">
                                <Link to="/collections" className="bg-primary text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:scale-110 active:scale-95 transition-all shadow-2xl">
                                    EXPLORE
                                </Link>
                            </div>
                        </motion.div>

                        <div className="lg:col-span-5 relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                                animate={{ opacity: 1, scale: 1, rotate: -5 }}
                                transition={{ duration: 1.2, delay: 0.2, ease: "circOut" }}
                                className="relative z-20 aspect-[3/4] rounded-[4rem] overflow-hidden border-2 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
                                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                            >
                                <img
                                    src="https://www.pixelstalk.net/wp-content/uploads/2016/07/HD-Free-Art-Pictures.jpg"
                                    className="w-full h-full object-cover transition-transform duration-[20s] hover:scale-125"
                                    alt="Hero Art"
                                />
                            </motion.div>
                            {/* Floating Geometric Orbs */}
                            <motion.div
                                animate={{ y: [0, -20, 0], rotate: [0, 90, 180] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-12 -right-12 w-32 h-32 border rounded-[2rem] backdrop-blur-sm z-10"
                                style={{ borderColor: 'var(--border-color)' }}
                            />
                            <motion.div
                                animate={{ y: [0, 30, 0], rotate: [0, -45, 0] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-20 -left-12 w-48 h-48 bg-secondary/20 rounded-full blur-[80px] z-0"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Asymmetrical Floating Gallery Section */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-20 items-center justify-between mb-32">
                        <motion.div
                            whileInView={{ opacity: 1, y: 0 }}
                            initial={{ opacity: 0, y: 50 }}
                            viewport={{ once: true }}
                            className="md:w-1/3"
                        >
                            <span className="text-secondary font-black uppercase tracking-[0.4em] text-xs mb-4 block">Manifesto</span>
                            <h2 className="text-5xl font-black mb-8 leading-tight" style={{ color: 'var(--text-primary)' }}>
                                Breaking the <br />
                                <span className="text-primary italic">Static Grid.</span>
                            </h2>
                            <p className="font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                We believe art shouldn't be boxed. Our platform evolves with the creator, providing an organic space where digital meets physical in a dance of pure creativity.
                            </p>
                        </motion.div>

                        <div className="md:w-1/2 flex gap-8">
                            <motion.div
                                whileInView={{ y: -40 }}
                                transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                                className="w-1/2 aspect-[4/5] rounded-[3rem] overflow-hidden border shadow-2xl mt-12"
                                style={{ borderColor: 'var(--border-color)' }}
                            >
                                <img src="https://tse3.mm.bing.net/th/id/OIP.UdLZZ6X94NbeQef4VdqeLwHaHa?pid=Api&P=0&h=500" className="w-full h-full object-cover" />
                            </motion.div>
                            <motion.div
                                whileInView={{ y: 40 }}
                                transition={{ duration: 2.5, repeat: Infinity, repeatType: "mirror" }}
                                className="w-1/2 aspect-[4/5] rounded-[3rem] overflow-hidden border shadow-2xl"
                                style={{ borderColor: 'var(--border-color)' }}
                            >
                                <img src="https://tse2.mm.bing.net/th/id/OIP.azeAKM2Glb23fXtMxwrKggHaE7?pid=Api&P=0&h=500" className="w-full h-full object-cover" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Creative Feature Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { color: "bg-primary", title: "IMMERSE", desc: "High-fidelity viewing experience for digital masters." },
                            { color: "bg-secondary", title: "PROTECT", desc: "Military-grade encryption for your artistic assets." },
                            { color: "bg-purple-600", title: "CONNECT", desc: "A direct link between artist soul and collector heart." }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                className="p-12 border rounded-[3rem] relative overflow-hidden group"
                                style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                            >
                                <div className={`absolute top-0 right-0 w-24 h-24 ${item.color} opacity-10 blur-3xl group-hover:opacity-40 transition-all`} />
                                <span className="text-4xl font-black mb-4 block tracking-tighter" style={{ color: 'var(--text-primary)' }}>{item.title}</span>
                                <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                                <div className="mt-8 flex items-center gap-2 font-bold text-xs uppercase tracking-widest group-hover:text-primary transition-colors" style={{ color: 'var(--text-secondary)' }}>
                                    Discover More <ArrowRight className="h-3 w-3" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
