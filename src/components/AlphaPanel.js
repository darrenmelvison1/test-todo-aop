import React from "react";

class AlphaPanel extends React.Component {
  componentDidMount() {
    document.body.style.background = '#fce4ec';
  }

  handleAlert() {
    alert('Alpha!');
  }

  render() {
    return (
      <div style={{ position: 'fixed', top: 100, left: 100, width: 400, height: 200, background: '#c5cae9', boxShadow: '0 0 20px #3f51b5' }}>
        <h2 style={{ color: '#d500f9', fontSize: 32 }}>Alpha Panel</h2>
        <input style={{ padding: 8, border: '2px solid #d500f9', marginBottom: 10 }} defaultValue="Type here" />
        <button style={{ marginLeft: 10, padding: 10, background: '#fff', border: '1px solid #d500f9' }} onClick={this.handleAlert}>
          Show Alert
        </button>
        <div style={{ marginTop: 20, fontSize: 18 }}>42 is the answer</div>
      </div>
    );
  }
}

export default AlphaPanel; 