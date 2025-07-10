import React from 'react';

interface ErrorProps {
    message?: string;
}

const Error: React.FC<ErrorProps> = ({ message }) => {
    return (
        <div className="min-h-[1.25rem]">
            {message && <p className="text-sm text-red-600">{message}</p>}
        </div>
    );
};

export default Error;
