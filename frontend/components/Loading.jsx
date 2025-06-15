export const Loading = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-white">
            <div className="flex flex-col items-center space-y-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin"></div>
                    <div className="absolute inset-3 bg-yellow-100 rounded-full"></div>
                </div>
                <span className="text-gray-800 font-medium text-lg">Loading Amazon...</span>
                <div className="w-40 h-1 bg-gray-200 rounded">
                    <div className="h-1 bg-yellow-400 rounded animate-pulse w-3/4"></div>
                </div>
            </div>
        </div>
    );
};
