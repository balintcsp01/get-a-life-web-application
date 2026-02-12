import {useEffect, useState} from "react";

function Test(){
    const [status, setStatus] = useState("Idle");
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const pingServer = async () => {
        setStatus("Pinging...");
        setError(null);

        try {
            const res = await fetch("http://localhost:8080/api/ping");
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.text();
            setResponse(data);
            setStatus("Success ✅");
        } catch (err) {
            setError(err.message);
            setStatus("Failed ❌");
        }
    };

// Optional: auto-ping on load
    useEffect(() => {
        pingServer();
    }, []);

    return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h1>Backend Connection Test</h1>

            <button onClick={pingServer}>Ping Server</button>

            <p><strong>Status:</strong> {status}</p>

            {response && (
                <pre>
          <strong>Response:</strong> {response}
        </pre>
            )}

            {error && (
                <p style={{ color: "red" }}>
                    <strong>Error:</strong> {error}
                </p>
            )}
        </div>
    );
}

export default Test;
