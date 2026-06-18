import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-10 bg-[#0c0c0c] text-white">
            <Helmet>
                <title>404 - Page Not Found | Figment Studio</title>
                <meta name="robots" content="noindex, follow" />
            </Helmet>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-8"
            >
                <h1 className="text-9xl font-black text-primary tracking-tighter mix-blend-screen">404</h1>
                <div className="space-y-4">
                    <h2 className="text-3xl font-black uppercase tracking-widest">Vision Not Found</h2>
                    <p className="text-zinc-500 max-w-md mx-auto">
                        The architectural coordinate you are trying to reach does not exist in our current blueprints.
                    </p>
                </div>

                <button
                    onClick={() => navigate('/')}
                    className="mt-8 px-10 py-4 bg-white text-black font-black uppercase tracking-[0.2em] rounded-full hover:bg-primary hover:text-white transition-all duration-300"
                >
                    Return to Studio
                </button>
            </motion.div>
        </div>
    );
};

export default NotFound;
