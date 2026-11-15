import { Link } from "react-router-dom";
import "./home.css";

function Home() {
    return (
        <div className="home-page">

            <section className="hero">

                <div className="hero-content">

                    <div className="hero-badge">
                        🌱 Digital Village Platform
                    </div>

                    <h1>
                        Connecting
                        <span> Villages </span>
                        With Technology
                    </h1>

                    <p>
                        Explore village information, discover local resources,
                        and get instant answers through our intelligent assistant.
                    </p>

                    <div className="hero-buttons">

                        <Link to="/villages" className="primary-button">
                            Explore Villages →
                        </Link>

                        <Link to="/chatbot" className="secondary-button">
                            💬 Ask Assistant
                        </Link>

                    </div>

                </div>

                <div className="hero-visual">

                    <div className="circle circle-one"></div>

                    <div className="circle circle-two"></div>

                    <div className="village-card">

                        <div className="village-icon">
                            🌾
                        </div>

                        <h3>
                            Village Information
                        </h3>

                        <p>
                            Discover your community
                        </p>

                    </div>

                </div>

            </section>

            <section className="features">

                <div className="feature-card">

                    <div className="feature-icon">
                        🏘️
                    </div>

                    <h3>
                        Village Directory
                    </h3>

                    <p>
                        Browse detailed information about villages and communities.
                    </p>

                </div>

                <div className="feature-card">

                    <div className="feature-icon">
                        🤖
                    </div>

                    <h3>
                        Smart Assistant
                    </h3>

                    <p>
                        Ask questions and get helpful answers instantly.
                    </p>

                </div>

                <div className="feature-card">

                    <div className="feature-icon">
                        📊
                    </div>

                    <h3>
                        Useful Information
                    </h3>

                    <p>
                        Access important information and resources in one place.
                    </p>

                </div>

            </section>

        </div>
    );
}

export default Home;