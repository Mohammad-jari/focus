import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Curriculum from '@/components/Curriculum';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import ChatPreview from '@/components/ChatPreview';
import BloomTaxonomy from '@/components/BloomTaxonomy';
import MissionVision from '@/components/MissionVision';
import Footer from '@/components/Footer';
import '@/index.css';
import "@/landing.css";
import "@/landing-global.css";

const iosSpringPhysics = {
    type: "spring",
    mass: 0.6,
    stiffness: 140,
    damping: 22,
    restDelta: 0.001
};

function Landing() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    const children = e.target.querySelectorAll('.how-card, .feat-card, .class-card, .mvv-item, .hero-stat');
                    children.forEach((el, i) => {
                        el.style.transitionDelay = (i * 0.1) + 's';
                        el.style.opacity = '0';
                        el.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                            el.style.transition = 'opacity .6s ease, transform .6s ease';
                        }, i * 100 + 100);
                    });
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className="landing-root">
            <div className="app-viewport">
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            className="ios-blur-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25, ease: "linear" }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                    )}
                </AnimatePresence>

                <motion.nav
                    className="ios-side-drawer"
                    initial={{ x: "-100%" }}
                    animate={{ x: isMobileMenuOpen ? "0%" : "-100%" }}
                    transition={iosSpringPhysics}
                >
                    <div className="ios-menu-inner">
                        <div className="ios-menu-header">TessaFocus</div>
                        <ul className="ios-menu-links">
                            <li><a href="#features" onClick={() => setIsMobileMenuOpen(false)}>Features</a></li>
                            <li><a href="#curriculum" onClick={() => setIsMobileMenuOpen(false)}>Curriculum</a></li>
                            <li><a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a></li>
                        </ul>
                        <div className="ios-menu-ctas">
                            <Link className="btn-ghost" to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                        </div>
                    </div>
                </motion.nav>

            <motion.main
                className="ios-main-canvas"
                animate={{
                    scale: isMobileMenuOpen ? 0.93 : 1,
                    x: isMobileMenuOpen ? 260 : 0,
                    borderRadius: isMobileMenuOpen ? "28px" : "0px"
                }}
                transition={iosSpringPhysics}
                style={{ pointerEvents: isMobileMenuOpen ? 'none' : 'auto' }}
            >
                <div className="starfield" style={{ position: 'absolute', inset: 0, height: '100%' }}></div>
                <div className="ios-scroll-content">
                    <Navbar isMobileMenuOpen={isMobileMenuOpen} toggleMenu={toggleMenu} />
                    <Hero />
                    <div className="wave-div"></div>
                    <HowItWorks />
                    <div className="wave-div"></div>
                    <Features />
                    <div className="wave-div"></div>
                    <Curriculum />
                    <div className="wave-div"></div>
                    <ChatPreview />
                    <div className="wave-div"></div>
                    <BloomTaxonomy />
                    <div className="wave-div"></div>
                    <MissionVision />
                    <div className="wave-div"></div>
                    <Footer />
                </div>
            </motion.main>
        </div>
        </div>
    );
}

export default Landing;
