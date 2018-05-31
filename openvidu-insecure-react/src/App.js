import React, { Component, Fragment } from 'react';
import { OpenVidu } from 'openvidu-browser';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      sessionId: `Session ${Math.floor(Math.random() * 100)}`,
      username: `Participant ${Math.floor(Math.random() * 100)}`
    };

    this.session = null;
  }

  bindWindowEvents() {
    window.onbeforeunload = this.beforeUnload.bind(this);
  }

  beforeUnload() {
    // Gracefully leave session
    if (this.session) {
        // removeUser();
        // leaveSession();
    }
    // logOut();
  }

  handleChange(field, e) {
    this.setState({
      [field]: e.target.value
    });
  }

  renderVideoSession(session_title) {
    if (!session_title) {
      return null;
    }

    return(
      <div id="session">
        <div id="session-header">
          <h1 id="session-title">{session_title}</h1>
          <input className="btn btn-large btn-danger" type="button" id="buttonLeaveSession" value="Leave session" />
        </div>
        <div id="main-video" className="col-md-6"><p></p><video autoPlay></video></div>
        <div id="video-container" className="col-md-6"></div>
      </div>
    )
  }

  render() {
    return (
      <Fragment>
        <nav className="navbar navbar-default">
          <div className="container">
            <div className="navbar-header">
              <a className="navbar-brand" href="/">
                <img alt="" className="demo-logo" src="resources/images/openvidu_vert_white_bg_trans_cropped.png"/>
                Insecure React.js
              </a>
              <a
                className="navbar-brand nav-icon"
                href="https://github.com/OpenVidu/openvidu-tutorials/tree/master/openvidu-insecure-js"
                title="GitHub Repository"
                rel="noopener noreferrer"
                target="_blank"
              >
                <i className="fa fa-github" aria-hidden="true"></i>
              </a>
              <a
                className="navbar-brand nav-icon"
                href="http://www.openvidu.io/docs/tutorials/openvidu-insecure-js/"
                title="Documentation"
                rel="noopener noreferrer"
                target="_blank"
              >
                <i className="fa fa-book" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </nav>

        <div id="main-container" className="container">
          <div id="join">
            <div id="img-div">
              <img src="resources/images/openvidu_grey_bg_transp_cropped.png" alt=""/>
            </div>
            <div id="join-dialog" className="jumbotron vertical-center">
              <h1>Join a video session</h1>
              <form className="form-group">
                <p>
                  <label>Participant</label>
                  <input onChange={this.handleChange.bind(this, 'username')} className="form-control" type="text" value={this.state.username} required />
                </p>
                <p>
                  <label>Session</label>
                  <input onChange={this.handleChange.bind(this, 'sessionId')} className="form-control" type="text" value={this.state.sessionId} required />
                </p>
                <p className="text-center">
                  <input className="btn btn-lg btn-success" type="submit" name="commit" value="Join!" />
                </p>
              </form>
            </div>
          </div>

          {this.renderVideoSession()}
        </div>

        <footer className="footer">
          <div className="container">
            <div className="text-muted">OpenVidu © 2017</div>
            <a
              href="http://www.openvidu.io/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <img className="openvidu-logo" src="resources/images/openvidu_globe_bg_transp_cropped.png" alt=""/>
            </a>
          </div>
        </footer>
      </Fragment>
    );
  }
}

export default App;
