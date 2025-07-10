import React from 'react';
import Error from './Error'; // Your reusable error component

type InputProps = {
    field: any;
    value: string;
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input = ({ field, value, error, onChange }: InputProps) => (
    <div className="mb-3">
        <input
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={value}
            onChange={onChange}
            className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 transition"
        />
        <Error message={error} />
    </div>
);

export default Input;
