import { Facebook, Instagram, Youtube, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-blue-600 text-white py-8">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
                <p className="text-center md:text-left mb-4 md:mb-0">&copy; 2025 Fit Finance. All rights reserved.</p>
                <div className="flex space-x-6">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">
                        <Facebook size={24} />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">
                        <Instagram size={24} />
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">
                        <Youtube size={24} />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition">
                        <Linkedin size={24} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;