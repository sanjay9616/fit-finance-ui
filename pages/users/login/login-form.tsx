import Input from '@/components/Input';
import { loginFields } from '@/config/constant';
import { FormField } from '@/config/interfaces';
import { userService } from '@/services/userService';
import { AppDispatch } from '@/store';
import { loginSuccess, logout } from '@/store/slices/authSlice';
import { hideLoader, showLoader } from '@/store/slices/loaderSlice';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

interface LoginFormProps {
    onLoginSuccess?: () => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
    const [formData, setFormData] = useState<{ [key: string]: string }>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        loginFields.forEach((field) => {
            const value = formData[field.name] || '';
            const { required, validation } = field;

            if (required && !value.trim()) {
                newErrors[field.name] = `${field.label || field.name} is required`;
            } else if (validation?.pattern && !validation.pattern.test(value)) {
                newErrors[field.name] = validation.message || `${field.label || field.name} is invalid`;
            } else if (validation?.minLength && value.length < validation.minLength) {
                newErrors[field.name] = validation.message || `${field.label || field.name} is too short`;
            }
        });

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(showLoader());
        try {
            const validationErrors = validate();
            if (Object.keys(validationErrors).length) {
                setErrors(validationErrors);
            } else {
                console.log("Form submitted:", formData);
                await loginUser();
            }
        } finally {
            dispatch(hideLoader());
        }
    };


    const loginUser = async () => {
        setErrors({});

        try {
            const data: any = await userService.loginUser(formData);
            toast.success(data?.message);
            setFormData({ email: '', password: '' });

            if (data?.status === 200 && data?.success) {
                const token = data?.user?.token;
                localStorage.setItem("token", token);
                await validateUser(token);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Login failed");
        }
    }

    const validateUser = async (token: string) => {
        try {
            const res = await userService.validateUser(token);
            if (res?.status === 200 && res?.success) {
                dispatch(loginSuccess(res?.user));
                if (onLoginSuccess) {
                    onLoginSuccess();
                } else {
                    router.push('/');
                }
            } else {
                toast.error(res?.message);
                localStorage.removeItem('token');
                dispatch(logout());
                router.push('/users/login');
            }
        } catch {
            localStorage.removeItem('token');
            dispatch(logout());
            router.push('/users/login');
        }
    };

    const handleSignUp = () => {
        router.push('/users/create');
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 md:p-8 bg-white shadow-xl rounded-xl transition-transform transform hover:scale-105">
            <h2 className="text-2xl md:text-3xl font-bold mb-1 text-blue-600 text-center">Sign In</h2>
            <p className="text-gray-600 text-center mb-5 text-sm">
                Login to track your workouts and manage expenses with ease.
            </p>
            <form onSubmit={handleSubmit}>

                {loginFields.map((field: FormField) => (
                    <Input
                        key={field.name}
                        field={field}
                        value={formData[field.name] || ''}
                        error={errors[field.name]}
                        onChange={handleChange}
                    />
                ))}

                <div className="text-gray-600 text-sm mt-0 mb-4">
                    Don&apos;t have an account?{' '}
                    <button
                        onClick={handleSignUp}
                        className="text-blue-600 hover:underline cursor-pointer"
                    >
                        Sign up here
                    </button>.
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default LoginForm;


