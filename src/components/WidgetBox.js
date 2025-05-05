import React from "react";

class WidgetBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return (
      <div style={{ width: 300, height: 300, background: "#ffecb3", border: "3px dotted #ff9800", margin: 50 }}>
        <h1 style={{ fontSize: 30, color: "#ff5722" }}>Widget</h1>
        <button style={{ padding: 10, background: "#fff", border: "1px solid #ff9800" }} onClick={() => this.setState({ count: this.state.count + 1 })}>
          Clicked {this.state.count} times
        </button>
        <div style={{ marginTop: 20, fontWeight: "bold" }}>Static text</div>
        <ul>
          <li>foo</li>
          <li>bar</li>
          <li>baz</li>
        </ul>
      </div>
    );
  }
}

export default WidgetBox; 