import React from "react";
import TableGenerator from "./components/main/TableGenerator";
import Header from "./components/common/Header";

function App() {
    return (
        <div className="min-h-screen antialiased">
            <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 md:px-8">
                <Header />
                <main>
                    <TableGenerator />
                </main>
                <footer className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400 text-sm">
                    <p>© {new Date().getFullYear()} Dohyeop Lim</p>
                </footer>
            </div>
        </div>
    );
}

export default App;
