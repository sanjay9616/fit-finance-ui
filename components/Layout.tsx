import Header from './Header';
import Footer from './Footer';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Toaster position="top-center" reverseOrder={false} />
            <main className="flex-1 container mx-auto p-4">{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;
