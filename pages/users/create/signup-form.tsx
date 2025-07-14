import Input from '@/components/Input';
import { signupFields } from '@/config/constant'; // Make sure this exists
import { FormField } from '@/config/interfaces';
import { MESSAGE } from '@/config/mesage';
import { userService } from '@/services/userService';
import { AppDispatch } from '@/store';
import { hideLoader, showLoader } from '@/store/slices/loaderSlice';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const SignupForm = () => {
    const [formData, setFormData] = useState<{ [key: string]: string }>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        signupFields.forEach((field) => {
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
        const validationErrors = validate();

        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            dispatch(hideLoader()); // hide if validation fails
            return;
        }

        try {
            const data: any = await userService.createUser(formData);
            toast.success(data?.message || 'User created successfully!');
            setFormData({});
            router.push('/users/login');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || MESSAGE.ERROR.SERVER_ERROR);
        } finally {
            dispatch(hideLoader());
        }
    };

    const handleLogin = () => {
        router.push('/users/login');
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 md:p-8 bg-white shadow-xl rounded-xl transition-transform transform hover:scale-105">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-blue-600 text-center">Create Account</h2>
            <p className="text-gray-600 mb-4 text-center text-sm">
                Start managing your finances and fitness today!
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                {signupFields.map((field: FormField) => (
                    <Input
                        key={field.name}
                        field={field}
                        value={formData[field.name] || ''}
                        error={errors[field.name]}
                        onChange={handleChange}
                    />
                ))}

                <p className="text-gray-600 text-sm mt-0 mb-4">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={handleLogin}
                        className="text-blue-600 hover:underline cursor-pointer"
                    >
                        Login here
                    </button>.
                </p>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default SignupForm;
