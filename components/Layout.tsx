import Header from './Header';
import Footer from './Footer';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import Loader from './Loader';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {

    const loading = useSelector((state: RootState) => state.loader.loading);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Toaster position="top-center" reverseOrder={false} />
            {loading && <Loader />}
            <main className="flex-1 container mx-auto p-4">{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;
