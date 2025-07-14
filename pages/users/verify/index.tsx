import Input from '@/components/Input';
import { loginFields } from '@/config/constant';
import { FormField } from '@/config/interfaces';
import { MESSAGE } from '@/config/mesage';
import { userService } from '@/services/userService';
import { AppDispatch } from '@/store';
import { hideLoader, showLoader } from '@/store/slices/loaderSlice';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const Index = () => {
    const [token, setToken] = useState('');
    const [formData, setFormData] = useState<{ [key: string]: string }>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, []);

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
        const validationErrors = validate();
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }

        dispatch(showLoader());
        try {
            const data: any = await userService.verifyUser(formData, token);
            toast.success(data?.message);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || MESSAGE.ERROR.SERVER_ERROR);
        } finally {
            dispatch(hideLoader());
        }
    };


    return (
        <div className="w-full max-w-md mx-auto p-4 md:p-8 bg-white shadow-xl rounded-xl transition-transform transform hover:scale-105">
            <h2 className="text-2xl md:text-3xl font-bold mb-1 text-blue-600 text-center">Verify Your Account</h2>
            <p className="text-gray-600 text-center mb-5 text-sm">
                Verify your account to activate features like workout tracking and smart expense management.
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

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Index;
