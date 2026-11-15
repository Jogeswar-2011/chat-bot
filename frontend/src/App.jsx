import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";

import Home from "../pages/home.jsx";
import ListVillages from "../pages/villagesdetails.jsx";
import Chatbot from "../pages/chatbot.jsx";

import "./App.css";

function App() {
    return (
        <Router>
            <div className="app">

                <nav className="navbar">
                    <div className="navbar-container">

                        <Link to="/" className="logo">
                            🌾 VillageConnect
                        </Link>

                        <div className="nav-links">

                            <Link to="/" className="nav-link">
                                Home
                            </Link>

                            <Link to="/villages" className="nav-link">
                                Villages
                            </Link>

                            <Link to="/chatbot" className="nav-chat">
                                💬 Ask Assistant
                            </Link>

                        </div>

                    </div>
                </nav>

                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/villages" element={<ListVillages />} />
                        <Route path="/chatbot" element={<Chatbot />} />
                    </Routes>
                </main>

            </div>
        </Router>
    );
}

export default App;