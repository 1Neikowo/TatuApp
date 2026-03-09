export const Footer = () => {
    return (
        <footer className="border-t py-6 md:py-0 dark:border-gray-800">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-gray-600 md:text-left dark:text-gray-400">
                        Built for tattoo lovers. © 2026 TatuApp.
                    </p>
                </div>
            </div>
        </footer>
    );
};
