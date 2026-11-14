function Navbar({ activeView, setActiveView }) {
    return (
        <nav className="navbar">
            <div className="brand">
                <span className="brand-icon">⌂</span>
                <h2>HomeCare</h2>
            </div>

            <div className="nav-links">
                <button
                    className={activeView === "member" ? "active" : ""}
                    onClick={() => setActiveView("member")}
                >
                    Member
                </button>

                <button
                    className={activeView === "manager" ? "active" : ""}
                    onClick={() => setActiveView("manager")}
                >
                    Manager
                </button>
            </div>
        </nav>
    );
}

export default Navbar;