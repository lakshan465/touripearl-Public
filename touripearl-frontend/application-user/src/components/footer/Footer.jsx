import React from 'react';
import { ArrowUp, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-secondary">
            {/* Sri Lankan inspired subtle wave pattern */}
            <div className="w-full h-1 bg-gradient-to-r from-secondary/20 via-light to-secondary/20" />

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
                    {/* About Us Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary dark:text-white">About Us</h3>
                        <p className="text-secondary dark:text-gray-400 text-sm sm:text-base leading-relaxed">
                            TouriPearl connects adventurous travelers with expert local guides
                            across the beautiful island of Sri Lanka. We make discovering our
                            paradise island's hidden gems easy and authentic.
                        </p>
                    </div>

                    {/* Quick Links Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary dark:text-white">Quick Links</h3>
                        <ul className="space-y-2">
                            {['Home', 'About', 'Services', 'Guides', 'Contact', 'FAQs'].map((link) => (
                                <li key={link}>
                                    <a href={`#${link.toLowerCase()}`} className="text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-gray-300 text-sm sm:text-base transition-colors">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary dark:text-white">Contact Us</h3>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-secondary dark:text-gray-400">
                                <MapPin className="w-4 h-4 text-accent" />
                                <span className="text-sm sm:text-base">123 Temple Road, Colombo, Sri Lanka</span>
                            </div>
                            <div className="flex items-center space-x-2 text-secondary dark:text-gray-400">
                                <Mail className="w-4 h-4 text-accent" />
                                <a href="mailto:info@touripearl.com" className="text-sm sm:text-base hover:text-primary dark:hover:text-gray-300">
                                    info@touripearl.com
                                </a>
                            </div>
                            <div className="flex items-center space-x-2 text-secondary dark:text-gray-400">
                                <Phone className="w-4 h-4 text-accent" />
                                <a href="tel:+94112345678" className="text-sm sm:text-base hover:text-primary dark:hover:text-gray-300">
                                    +94 11 234 5678
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary dark:text-white">Follow Us</h3>
                        <div className="flex space-x-4">
                            {[
                                { Icon: Facebook, label: 'Facebook', color: '#3b5998' },
                                { Icon: Instagram, label: 'Instagram', color: '#E1306C' },
                                { Icon: Twitter, label: 'Twitter', color: '#1DA1F2' }
                            ].map(({ Icon, label, color }) => (
                                <a
                                    key={label}
                                    href={`#${label.toLowerCase()}`}
                                    className="text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-gray-300 transition-colors"
                                    aria-label={label}
                                >
                                    <Icon className="w-5 h-5 text-accent" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright and Back to Top */}
                <div className="mt-12 pt-8 border-t border-secondary flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm sm:text-base text-secondary dark:text-gray-400">
                        © {currentYear} TouriPearl. All rights reserved.
                    </p>
                    <button
                        onClick={scrollToTop}
                        className="mt-4 sm:mt-0 flex items-center space-x-2 text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-gray-300 transition-colors"
                        aria-label="Back to top"
                    >
                        <span className="text-sm sm:text-base">Back to top</span>
                        <ArrowUp className="w-4 h-4 text-accent" />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;