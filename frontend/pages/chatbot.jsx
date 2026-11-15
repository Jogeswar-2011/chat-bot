import { useState } from "react";
import "./chatbot.css";
import axios from "axios";

function Chatbot() {
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "Hello! 👋 I'm your Village Assistant. How can I help you today?",
        },
    ]);

    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // ==============================
    // GEMINI CHAT
    // ==============================

    async function handleSubmit(e) {
        e.preventDefault();

        const text = input.trim();

        if (!text || isTyping) return;

        // Show user message
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                text: text,
            },
        ]);

        setInput("");
        setIsTyping(true);

        try {
            // Send message to Django -> Gemini
            const response = await axios.post(
                "http://127.0.0.1:8000/chat/",
                {
                    text: text,
                }
            );

            // Show Gemini response
            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    text: response.data.reply,
                },
            ]);

        } catch (error) {
            console.error("Chat API error:", error);

            let errorMessage =
                "Sorry, I couldn't connect to the Village Assistant server.";

            if (error.response?.data?.error) {
                console.error(
                    "Backend error:",
                    error.response.data.error
                );
            }

            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    text: errorMessage,
                },
            ]);

        } finally {
            setIsTyping(false);
        }
    }


    // ==============================
    // GOOGLE MAPS SEARCH
    // ==============================

    async function searchPlaces() {
        const text = input.trim();

        if (!text || isTyping) return;

        // Check browser geolocation support
        if (!navigator.geolocation) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    text: "Your browser does not support location services.",
                },
            ]);

            return;
        }

        // Show user message
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                text: `📍 Find nearby: ${text}`,
            },
        ]);

        setInput("");
        setIsTyping(true);


        // Get user's location
        navigator.geolocation.getCurrentPosition(
            async (position) => {

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                console.log("User latitude:", latitude);
                console.log("User longitude:", longitude);

                try {

                    // Send location + search query to Django
                    const response = await axios.post(
                        "http://127.0.0.1:8000/maps/search/",
                        {
                            query: text,
                            latitude: latitude,
                            longitude: longitude,
                        }
                    );

                    console.log(
                        "Google Maps results:",
                        response.data
                    );

                    const places = response.data.places || [];


                    // No results
                    if (places.length === 0) {

                        setMessages((prev) => [
                            ...prev,
                            {
                                role: "bot",
                                text: `I couldn't find any nearby ${text}.`,
                            },
                        ]);

                        return;
                    }


                    // Format results
                    const resultText = places
                        .map((place, index) => {

                            let result = `${index + 1}. ${place.name}`;

                            if (place.address) {
                                result += `\n📍 ${place.address}`;
                            }

                            if (place.rating) {
                                result += `\n⭐ ${place.rating}`;
                            }

                            return result;
                        })
                        .join("\n\n");


                    // Show results
                    setMessages((prev) => [
                        ...prev,
                        {
                            role: "bot",
                            text: resultText,
                        },
                    ]);

                } catch (error) {

                    console.error(
                        "Maps API error:",
                        error
                    );

                    if (error.response) {
                        console.error(
                            "Backend response:",
                            error.response.data
                        );
                    }

                    setMessages((prev) => [
                        ...prev,
                        {
                            role: "bot",
                            text: "Sorry, I couldn't search Google Maps right now.",
                        },
                    ]);

                } finally {

                    setIsTyping(false);

                }
            },


            // Location error
            (error) => {

                console.error(
                    "Location error:",
                    error
                );

                let message =
                    "I need your location permission to find nearby places.";

                if (error.code === 1) {
                    message =
                        "Location permission was denied. Please allow location access and try again.";
                }

                if (error.code === 2) {
                    message =
                        "Your location could not be determined.";
                }

                if (error.code === 3) {
                    message =
                        "Location request timed out. Please try again.";
                }

                setMessages((prev) => [
                    ...prev,
                    {
                        role: "bot",
                        text: message,
                    },
                ]);

                setIsTyping(false);
            },

            // Geolocation options
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }


    // ==============================
    // CLEAR CHAT
    // ==============================

    const clearChat = () => {

        setMessages([
            {
                role: "bot",
                text: "Hello! 👋 I'm your Village Assistant. How can I help you today?",
            },
        ]);

    };


    // ==============================
    // UI
    // ==============================

    return (
        <div className="chatbot-page">

            <div className="chat-container">


                {/* ================= HEADER ================= */}

                <div className="chat-header">

                    <div className="assistant-profile">

                        <div className="assistant-avatar">
                            🤖
                            <span className="online-dot"></span>
                        </div>

                        <div>

                            <h2>
                                Village Assistant
                            </h2>

                            <p>
                                ● Online • Ready to help
                            </p>

                        </div>

                    </div>


                    <button
                        className="clear-button"
                        onClick={clearChat}
                    >
                        Clear
                    </button>

                </div>


                {/* ================= MESSAGES ================= */}

                <div className="chat-messages">

                    {messages.map((message, index) => (

                        <div
                            key={index}
                            className={`message-row ${message.role}`}
                        >

                            {/* Bot avatar */}

                            {message.role === "bot" && (

                                <div className="message-avatar">
                                    🤖
                                </div>

                            )}


                            {/* Message */}

                            <div className="message-bubble">

                                {message.text
                                    .split("\n")
                                    .map((line, i) => (
                                        <div key={i}>
                                            {line}
                                        </div>
                                    ))}

                            </div>

                        </div>

                    ))}


                    {/* ================= TYPING ================= */}

                    {isTyping && (

                        <div className="message-row bot">

                            <div className="message-avatar">
                                🤖
                            </div>

                            <div className="message-bubble typing">

                                <span></span>
                                <span></span>
                                <span></span>

                            </div>

                        </div>

                    )}

                </div>


                {/* ================= INPUT ================= */}

                <form
                    className="chat-input-area"
                    onSubmit={handleSubmit}
                >

                    <input
                        type="text"
                        placeholder="Ask something about your village..."
                        value={input}
                        onChange={(e) =>
                            setInput(e.target.value)
                        }
                    />


                    {/* Google Maps button */}

                    <button
                        type="button"
                        className="maps-button"
                        onClick={searchPlaces}
                        disabled={
                            !input.trim() ||
                            isTyping
                        }
                        title="Find nearby places"
                    >
                        📍
                    </button>


                    {/* Gemini send button */}

                    <button
                        type="submit"
                        className="send-button"
                        disabled={
                            !input.trim() ||
                            isTyping
                        }
                        title="Ask Village Assistant"
                    >
                        ➤
                    </button>

                </form>


                {/* ================= DISCLAIMER ================= */}

                <p className="chat-disclaimer">
                    AI responses may occasionally be inaccurate.
                </p>

            </div>

        </div>
    );
}

export default Chatbot;