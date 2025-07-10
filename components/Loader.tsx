interface LoaderProps {
    message?: string;
}

const Loader = ({ message = "Loading..." }: LoaderProps) => {
    return (
        <div className="loader-container flex flex-col items-center justify-center h-screen w-full bg-white/70 z-[100] fixed top-0 left-0">
            <div className="loader flex flex-col items-center justify-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-r-transparent" role="status"></div>
                <div className="mt-4 text-blue-600 text-base font-medium">{message}</div>
            </div>
        </div>
    );
};

export default Loader;
