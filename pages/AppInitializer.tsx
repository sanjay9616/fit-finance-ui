import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { userService } from '@/services/userService';
import { loginSuccess, logout } from '@/store/slices/authSlice';
import { toast } from 'react-hot-toast';

interface Props {
    onReady: () => void;
}

const AppInitializer = ({ onReady }: Props) => {
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const publicPages = ['/', '/users/create', '/users/verify'];
            const isProtectedPage = !publicPages.includes(router.pathname);

            const handleLogout = (message?: string) => {
                if (message) toast.error(message);
                localStorage.removeItem('token');
                dispatch(logout());
                if (isProtectedPage) router.replace('/users/login');
                onReady();
            };

            if (!token) {
                if (isProtectedPage) router.replace('/users/login');
                onReady();
                return;
            }

            try {
                const res = await userService.validateUser(token);
                if (res?.status === 200 && res?.success && res?.user?.id) {
                    dispatch(loginSuccess(res.user));
                } else {
                    handleLogout(res?.message || 'Session expired');
                    return;
                }
            } catch {
                handleLogout('ERROR: Something went wrong. Please login again.');
                return;
            }

            onReady();
        };

        checkAuth();
    }, []);

    return null;
};

export default AppInitializer;
