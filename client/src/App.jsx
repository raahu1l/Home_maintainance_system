import { useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import RequestForm from "./components/RequestForm";
import RequestTracker from "./components/RequestTracker";

function App() {
    const [activeView, setActiveView] = useState("member");


    return (
        <div className="app">
            <Navbar
                activeView={activeView}
                setActiveView={setActiveView}
            />

            <main className="main-content">
                {activeView === "member" ? (
                   <> <RequestForm/>
                    <RequestTracker /> </>
                ) : (
                    <h1>Manager Dashboard</h1>
                )}
            </main>
        </div>
    );
}

export default App;