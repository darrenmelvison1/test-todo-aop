import React from "react";

class OldStatistics extends React.Component {
  render() {
    const stats = [
      { label: "Completed Todos", value: 12 },
      { label: "Pending Todos", value: 5 },
      { label: "Overdue Todos", value: 2 },
    ];
    return (
      <div style={{ padding: 20, background: "#e0f7fa", borderRadius: 8 }}>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>Statistics</h2>
        <ul>
          {stats.map((stat, idx) => (
            <li key={idx} style={{ marginBottom: 8, fontSize: 18 }}>
              {stat.label}: {stat.value}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default OldStatistics; 