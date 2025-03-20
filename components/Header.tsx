import Link from 'next/link';

const Header = () => {
    return (
        <header className="bg-blue-600 text-white py-4">
            <nav className="container mx-auto flex justify-between">
                <h1 className="text-xl font-bold">My Next.js App</h1>
                <ul className="flex space-x-4">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/about">About</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
