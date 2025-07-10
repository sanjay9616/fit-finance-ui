import { useState } from 'react';
import { ChevronRight, Menu, User, X } from 'lucide-react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { features } from '@/config/constant';
import toast from 'react-hot-toast';
import { logout } from '@/store/slices/authSlice';
import Image from 'next/image';
import { Features } from '@/config/interfaces';

const Header = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const navLinks = ['Features', 'Pricing', 'Contact'];

    const handleRedirection = (path: string | null | undefined) => {
        setMenuOpen(false);
        if (user?.id && path) {
            router.push(path);
        } else if (!user?.id) {
            toast.error('Please login to continue.');
            router.push('/users/login')
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(logout());
        setMenuOpen(false);
        router.push('/users/login');
    }

    return (
        <header className="bg-gradient-to-r from-indigo-600 to-blue-500 shadow-lg sticky top-0 z-50">
            {/* Desktop View */}
            <div className="flex items-center justify-between px-4 py-3 md:px-8">
                <div onClick={() => router.push('/')} className="flex items-center cursor-pointer">
                    <Image
                        src="/logo-3.png"
                        alt="Logo"
                        width={35}
                        height={35}
                        className="object-contain rounded-full"
                        priority
                    />
                </div>
                <nav className="hidden md:flex items-center space-x-6">
                    {navLinks.map((link) => (
                        <a
                            key={link}
                            href={`#${link.toLowerCase()}`}
                            className="text-white hover:text-yellow-300 transition font-medium"
                        >
                            {link}
                        </a>
                    ))}

                    {user?.id ? (
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white font-medium">
                                <User size={18} />
                                <span>{user.name}</span>
                            </div>
                            <button onClick={handleLogout} className="bg-red-500 text-white font-semibold px-5 py-2 rounded-full hover:bg-red-600 transition">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <button onClick={() => router.push('/users/login')} className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-full hover:bg-gray-100 transition">
                                Sign In
                            </button>
                            <button onClick={() => router.push('/users/create')} className="bg-yellow-300 text-blue-900 font-semibold px-5 py-2 rounded-full hover:bg-yellow-400 transition">
                                Sign Up
                            </button>
                        </div>
                    )}
                </nav>

                {/* Mobile Menu Icon */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-white"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                >
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>


            {/* Mobile View */}
            <div className="md:hidden">
                <div className={`fixed top-0 left-0 h-full w-full max-w-xs bg-white z-50 shadow-xl transform-gpu transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-full">
                                {user?.id ? (
                                    <span className="text-white bg-blue-600 w-full h-full flex items-center justify-center rounded-full font-semibold text-sm uppercase">
                                        {user?.name
                                            ?.split(' ')
                                            .map((n: string) => n[0])
                                            .slice(0, 2)
                                            .join('')}
                                    </span>
                                ) : (
                                    <User className="text-blue-600" size={20} />
                                )}
                            </div>

                            {user?.id ? (
                                <span className="text-blue-700 font-semibold text-base">{user.name}</span>
                            ) : (
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        router.push('/users/login');
                                    }}
                                    className="text-blue-600 font-medium hover:underline"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => setMenuOpen(false)}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-blue-200 text-blue-600 hover:bg-blue-100 transition"
                            aria-label="Close menu"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex flex-col gap-3 px-6 py-6 text-base font-medium">
                        {features.map((item: Features) => (
                            <button
                                key={item.title}
                                onClick={() => handleRedirection(item.path)}
                                className="flex justify-between items-center w-full text-left text-blue-700 hover:text-indigo-600 transition py-2"
                            >
                                <span>{item.title}</span>
                                <ChevronRight size={18} className="text-blue-500" />
                            </button>
                        ))}

                        <hr className="border-t border-gray-200 my-4" />

                        {user?.id ? (
                            <button
                                onClick={handleLogout}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-full font-semibold shadow hover:scale-105 transition-transform"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    router.push('/users/create');
                                }}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-full font-semibold shadow hover:scale-105 transition-transform"
                            >
                                Sign Up
                            </button>
                        )}
                    </div>
                </div>
            </div>



            {/* Overlay when mobile menu is open */}
            {menuOpen && (
                <div className="fixed inset-0 bg-black opacity-40 z-40" onClick={() => setMenuOpen(false)} />
            )}
        </header>
    );
};

export default Header;
