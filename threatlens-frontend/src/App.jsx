import { useEffect, useState } from "react";
import axios from "axios";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import "./App.css";

function App() {
    const [summary, setSummary] = useState({});
    const [threats, setThreats] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [severityFilter, setSeverityFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [newThreat, setNewThreat] = useState({
        threatType: "",
        sourceIp: ""
    });

    const [notes, setNotes] = useState({});

    const fetchData = () => {
        axios.get("http://localhost:8080/api/dashboard/summary")
            .then((response) => setSummary(response.data));

        axios.get("http://localhost:8080/api/threats/recent")
            .then((response) => {
                setThreats(response.data);

                const notesMap = {};
                response.data.forEach((threat) => {
                    notesMap[threat.id] = threat.analystNotes || "";
                });

                setNotes(notesMap);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addThreat = (e) => {
        e.preventDefault();

        axios.post("http://localhost:8080/api/threats", newThreat)
            .then(() => {
                setNewThreat({ threatType: "", sourceIp: "" });
                fetchData();
            });
    };

    const resolveThreat = (id) => {
        axios.put(`http://localhost:8080/api/threats/${id}/status?status=RESOLVED`)
            .then(() => fetchData());
    };

    const saveNotes = (id) => {
        const encodedNotes = encodeURIComponent(notes[id] || "");

        axios.put(`http://localhost:8080/api/threats/${id}/notes?notes=${encodedNotes}`)
            .then(() => fetchData());
    };

    const severityData = [
        { name: "High", value: summary.highThreats || 0 },
        { name: "Medium", value: summary.mediumThreats || 0 },
        { name: "Low", value: summary.lowThreats || 0 }
    ];

    const statusData = [
        { name: "Open", value: summary.openThreats || 0 },
        { name: "Resolved", value: summary.resolvedThreats || 0 }
    ];

    const threatTypeData = [
        { name: "Brute Force", value: summary.bruteForceAttacks || 0 },
        { name: "SQL Injection", value: summary.sqlInjectionAttacks || 0 },
        { name: "Malware", value: summary.malwareDetections || 0 }
    ];

    const filteredThreats = threats.filter((threat) => {
        const matchesSearch = threat.threatType
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesSeverity =
            severityFilter === "ALL" || threat.severity === severityFilter;

        const matchesStatus =
            statusFilter === "ALL" || threat.status === statusFilter;

        return matchesSearch && matchesSeverity && matchesStatus;
    });

    const exportToCSV = () => {
        const headers = ["ID", "Threat Type", "Severity", "Status", "Analyst Notes"];

        const rows = filteredThreats.map((threat) => [
            threat.id,
            threat.threatType,
            threat.severity,
            threat.status,
            notes[threat.id] || ""
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row) =>
                row.map((value) => `"${value}"`).join(",")
            )
        ].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "threatlens-report.csv");

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const colors = ["#dc2626", "#f59e0b", "#16a34a"];

    return (
        <div className="dashboard">
            <h1>ThreatLens Cybersecurity Dashboard</h1>
            <p className="subtitle">Real-time threat monitoring system</p>

            <div className="cards">
                <div className="card">
                    <h2>Total Threats</h2>
                    <p>{summary.totalThreats || 0}</p>
                </div>

                <div className="card">
                    <h2>High Threats</h2>
                    <p>{summary.highThreats || 0}</p>
                </div>

                <div className="card">
                    <h2>Open Threats</h2>
                    <p>{summary.openThreats || 0}</p>
                </div>

                <div className="card">
                    <h2>Resolved</h2>
                    <p>{summary.resolvedThreats || 0}</p>
                </div>
            </div>

            <form className="add-threat-form" onSubmit={addThreat}>
                <h2>Add New Threat</h2>

                <div className="form-row">
                    <select
                        value={newThreat.threatType}
                        onChange={(e) =>
                            setNewThreat({ ...newThreat, threatType: e.target.value })
                        }
                        required
                    >
                        <option value="">Select Threat Type</option>
                        <option value="Brute Force Attack">Brute Force Attack</option>
                        <option value="SQL Injection">SQL Injection</option>
                        <option value="Malware Detection">Malware Detection</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Source IP e.g. 192.168.1.100"
                        value={newThreat.sourceIp}
                        onChange={(e) =>
                            setNewThreat({ ...newThreat, sourceIp: e.target.value })
                        }
                        required
                    />

                    <button type="submit">Add Threat</button>
                </div>
            </form>

            <div className="charts">
                <div className="chart-card">
                    <h2>Threat Severity</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={severityData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={100}
                                label
                            >
                                {severityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h2>Threat Status</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={statusData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#38bdf8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h2>Threat Types</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={threatTypeData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#22d3ee" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <h2 className="section-title">Recent Threat Activity</h2>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search threat type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                >
                    <option value="ALL">All Severities</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="ALL">All Status</option>
                    <option value="OPEN">Open</option>
                    <option value="RESOLVED">Resolved</option>
                </select>
            </div>

            <button className="export-btn" onClick={exportToCSV}>
                Export Threat Report
            </button>

            <table className="threat-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Threat Type</th>
                    <th>Severity</th>
                    <th>Status</th>
                    <th>Analyst Notes</th>
                    <th>Action</th>
                </tr>
                </thead>

                <tbody>
                {filteredThreats.map((threat) => (
                    <tr key={threat.id}>
                        <td>{threat.id}</td>

                        <td>{threat.threatType}</td>

                        <td>
                <span className={`severity ${threat.severity.toLowerCase()}`}>
                  {threat.severity}
                </span>
                        </td>

                        <td>{threat.status}</td>

                        <td>
                <textarea
                    className="notes-input"
                    value={notes[threat.id] || ""}
                    placeholder="Add investigation notes..."
                    onChange={(e) =>
                        setNotes({ ...notes, [threat.id]: e.target.value })
                    }
                />

                            <button
                                className="notes-btn"
                                onClick={() => saveNotes(threat.id)}
                            >
                                Save Notes
                            </button>
                        </td>

                        <td>
                            {threat.status !== "RESOLVED" ? (
                                <button
                                    className="resolve-btn"
                                    onClick={() => resolveThreat(threat.id)}
                                >
                                    Resolve
                                </button>
                            ) : (
                                <span className="resolved-text">Done</span>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;