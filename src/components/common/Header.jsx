const Header = ({ title = "Texy" }) => {
    return (
        <header className="pt-24 pb-12">
            <div>
                <span className="text-sm sm:text-base">
                    A LaTeX table generator
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold mt-1">{title}</h1>
            </div>
        </header>
    );
};

export default Header;
