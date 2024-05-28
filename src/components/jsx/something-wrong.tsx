import { logoImg } from "@/assets/images";

export function SomethingWrongPage() {
    const handleGoBack = () => {
        window.history.back();
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <img src={logoImg.src} alt="Logo" className="mb-8 w-32" />
            <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h1>
            <p className="text-gray-600 mb-8">Please try again or go back to the previous page.</p>
            <button
                onClick={handleGoBack}
                className="px-4 py-2 bg-primary text-white font-bold rounded hover:bg-secondary"
            >
                Go Back
            </button>
        </div>
    );
}
