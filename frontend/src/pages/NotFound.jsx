import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
            >
                <h1 className="text-8xl font-black text-primary">404</h1>

                <h2 className="mt-4 text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    Page Not Found
                </h2>

                <p className="mt-3 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
                    The page you're looking for doesn't exist or may have been moved.
                </p>

                <Link
                    to="/"
                    className="inline-block mt-8 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:scale-105 transition shadow-lg shadow-primary/25"
                >
                    Return Home
                </Link>
            </motion.div>
        </div>
    );
}