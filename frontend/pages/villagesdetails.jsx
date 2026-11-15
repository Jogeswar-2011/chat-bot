import "./villages.css";
import { useState,useEffect } from "react";
import axios from "axios";

function ListVillages() {
    const [villages, setVillages] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [population, setPopulation] = useState("");
    const [area, setArea] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        const newVillage = {
            name: name,
            population: population,
            area: area,
        };

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/villages/",
                newVillage
            );

            setVillages([...villages, response.data]);

            setName("");
            setPopulation("");
            setArea("");
            setShowForm(false);

        } catch (error) {
            console.error("Error adding village:", error);
        }
    }
    useEffect(() => {
        async function fetchVillages() {
            try {
                const response = await axios.get("http://127.0.0.1:8000/villages/");
                setVillages(response.data);
            } catch (error) {
                console.error("Error fetching villages:", error);
            }
        }

        fetchVillages();
    }, []);

    return (
        <div className="villages-page">

            <div className="villages-header">

                <div>
                    <span className="section-label">
                        COMMUNITIES
                    </span>

                    <h1>
                        Explore Villages
                    </h1>

                    <p>
                        Find information about villages and their communities.
                    </p>
                </div>

                <div className="header-actions">

                    <div className="village-count">
                        <strong>
                            {villages.length}
                        </strong>

                        <span>
                            Villages
                        </span>
                    </div>

                    <button
                        className="add-village-button"
                        onClick={() => setShowForm(true)}
                    >
                        + Add Village
                    </button>

                </div>

            </div>


            {showForm && (
                <div className="form-overlay">

                    <div className="village-form-container">

                        <div className="form-header">

                            <div>
                                <span className="section-label">
                                    NEW VILLAGE
                                </span>

                                <h2>
                                    Add Village
                                </h2>
                            </div>

                            <button
                                className="close-form"
                                onClick={() => setShowForm(false)}
                            >
                                ✕
                            </button>

                        </div>


                        <form onSubmit={handleSubmit}>

                            <div className="form-group">

                                <label>
                                    Village Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter village name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Population
                                </label>

                                <input
                                    type="number"
                                    name="population"
                                    placeholder="Enter population"
                                    min="0"
                                    value={population}
                                    onChange={(e) => setPopulation(e.target.value)}
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Area
                                </label>

                                <input
                                    type="text"
                                    name="area"
                                    placeholder="Enter area"
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    required
                                />

                            </div>


                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-button"
                                >
                                    Add Village
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}


            {villages.length === 0 ? (

                <div className="empty-state">

                    <div className="empty-icon">
                        🏡
                    </div>

                    <h2>
                        No Villages Added
                    </h2>

                    <p>
                        Start by adding your first village.
                    </p>

                    <button
                        className="empty-add-button"
                        onClick={() => setShowForm(true)}
                    >
                        + Add First Village
                    </button>

                </div>

            ) : (

                <div className="villages-grid">

                    {villages.map((village) => (

                        <div
                            className="village-list-card"
                            key={village.id}
                        >

                            <div className="village-card-top">

                                <div className="small-village-icon">
                                    🏡
                                </div>

                                <span className="status">
                                    Active
                                </span>

                            </div>

                            <h2>
                                {village.name}
                            </h2>

                            <p className="district">
                                👥 Population: {village.population}
                            </p>

                            <p className="description">
                                📐 Area: {village.area}
                            </p>

                            <button className="view-button">
                                View Details →
                            </button>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default ListVillages;