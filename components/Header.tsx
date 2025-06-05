import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/router';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleSignUp = () => {
        router.push('/users/create');
    };

    return (
        <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 relative shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <h1
                    className="text-3xl md:text-4xl font-extrabold tracking-wide cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => router.push('/')}
                >
                    Fit <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-500">Finance</span>
                </h1>
                {/* Desktop Navigation */}
                <nav className="hidden md:flex md:items-center md:space-x-8">
                    {['Financial Reports', 'Pricing', 'Contact'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="py-2 transition-transform duration-300 hover:scale-105 hover:text-yellow-300">{item}</a>
                    ))}
                    <button onClick={handleSignUp} className="bg-yellow-400 text-blue-900 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-yellow-500 transition-transform transform hover:scale-105">Sign Up</button>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden block focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-full p-2 cursor-pointer z-30" aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
                >
                    {isOpen ? <X size={32} /> : <Menu size={32} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            <nav className={`md:hidden absolute left-0 w-full bg-blue-600 text-center p-6 z-20 transition-all duration-500 ease-in-out ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                {['Financial Reports', 'Pricing', 'Contact'].map((item) => (
                    <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="block py-3 text-lg font-semibold transition-colors duration-300 hover:text-yellow-300">{item}</a>
                ))}
                <button className="bg-yellow-400 text-blue-900 font-semibold px-6 py-3 rounded-lg mt-6 shadow-md hover:bg-yellow-500 transition-transform transform hover:scale-105">Sign Up</button>
            </nav>
        </header>
    );
};

export default Header;
