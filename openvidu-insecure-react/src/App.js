import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { OpenVidu } from 'openvidu-browser';

import { getToken } from './actions';

import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      isActiveSession: false,
      sessionName: `Session ${Math.floor(Math.random() * 100)}`,
      username: `Participant ${Math.floor(Math.random() * 100)}`,
      connections: {}
    };

    this.session = null

    this.bindWindowEvents();

    this.initMainVideo.bind(this);
    this.appendUserData.bind(this);
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

  handleInputChange(field, e) {
    this.setState({
      [field]: e.target.value
    });
  }

  joinSession(e) {
    e.preventDefault();
    
    const payload = {
      username: this.state.username,
      sessionName: this.state.sessionName
    };

    this.props.getToken(payload).then(res => {
      const token = res.payload.data[0];

      this.initOpenViduSession(token);
    });
  }

  initMainVideo(videoElement) {
    const videoDom = document.querySelector('#main-video video');

    videoDom.srcObject = videoElement.srcObject;
    videoDom.muted = 'muted';
  }

  appendUserData(videoElement, connection) {
    debugger;
    var clientData = JSON.parse(connection.data.split('%/%')[0]).clientData;
    var serverData = JSON.parse(connection.data.split('%/%')[1]).serverData;
    var nodeId = connection.connectionId;
    this.setState({
      connections: {
        [nodeId]: connection
      }
    });
    
    // var dataNode = document.createElement('div');
    // dataNode.className = "data-node";
    // dataNode.id = "data-" + nodeId;
    // dataNode.innerHTML = "<p class='nickName'>" + clientData + "</p><p class='userName'>" + serverData + "</p>";
    // videoElement.parentNode.insertBefore(dataNode, videoElement.nextSibling);

    // var clientData;
    // var serverData;
    // var nodeId;
    // if (connection.nickName) { // Appending local video data
    //   clientData = connection.nickName;
    //   serverData = connection.userName;
    //   nodeId = 'main-videodata';
    // } else {
    //   clientData = JSON.parse(connection.data.split('%/%')[0]).clientData;
    //   serverData = JSON.parse(connection.data.split('%/%')[1]).serverData;
    //   nodeId = connection.connectionId;
    // }
    // var dataNode = document.createElement('div');
    // dataNode.className = "data-node";
    // dataNode.id = "data-" + nodeId;
    // dataNode.innerHTML = "<p class='nickName'>" + clientData + "</p><p class='userName'>" + serverData + "</p>";
    // videoElement.parentNode.insertBefore(dataNode, videoElement.nextSibling);
  }

  removeUserData() {

  }

  initOpenViduSession(token) {
    // --- 1) Get an OpenVidu object ---

    const OV = new OpenVidu();

    // --- 2) Init a session ---

    this.session = OV.initSession();

    // --- 3) Specify the actions when events take place in the session ---

    // On every new Stream received...
    this.session.on('streamCreated', (event) => {

      // Subscribe to the Stream to receive it
      // HTML video will be appended to element with 'video-container' id
      var subscriber = this.session.subscribe(event.stream, 'video-container');

      // When the HTML video has been appended to DOM...
      subscriber.on('videoElementCreated', (event) => {
        debugger;
        // Add a new HTML element for the user's name and nickname over its video
        this.appendUserData(event.element, subscriber.stream.connection);
      });
    });

    // On every Stream destroyed...
    this.session.on('streamDestroyed', (event) => {
      // Delete the HTML element with the user's name and nickname
      this.removeUserData(event.stream.connection);
    });

    // --- 4) Connect to the session passing the retrieved token and some more data from
    //        the client (in this case a JSON with the nickname chosen by the user) ---
    
    var username = this.state.username;
    this.session.connect(token, { clientData: username })
      .then(() => {

        this.setState({
          isActiveSession: true
        });

        const publisher = OV.initPublisher('video-container', {
          audioSource: undefined, // The source of audio. If undefined default microphone
          videoSource: undefined, // The source of video. If undefined default webcam
          publishAudio: true,   // Whether you want to start publishing with your audio unmuted or not
          publishVideo: true,   // Whether you want to start publishing with your video enabled or not
          resolution: '640x480',  // The resolution of your video
          frameRate: 30,      // The frame rate of your video
          insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
          mirror: false         // Whether to mirror your local video or not
        });

        // When our HTML video has been added to DOM...
        publisher.on('videoElementCreated', (event) => {
          // Init the main video with ours and append our data
          const userData = {
            username: username
          };
          
          this.initMainVideo(event.element, userData);

          // @todo: select the element and mute the video
          // $(event.element).prop('muted', true); // Mute local video
        });


        // --- 8) Publish your stream ---

        this.session.publish(publisher);
      })
      .catch(error => {
        console.warn('There was an error connecting to the session:', error.code, error.message);
      });
  }

  renderJoinDetails() {
    const { isActiveSession } = this.state;
    if (isActiveSession) {
      return null;
    }

    return (
      <div id="join">
        <div id="img-div">
          <img src="resources/images/openvidu_grey_bg_transp_cropped.png" alt=""/>
        </div>
        <div id="join-dialog" className="jumbotron vertical-center">
          <h1>Join a video session</h1>
          <form className="form-group" onSubmit={this.joinSession.bind(this)}>
            <p>
              <label>Participant</label>
              <input onChange={this.handleInputChange.bind(this, 'username')} className="form-control" type="text" value={this.state.username} required />
            </p>
            <p>
              <label>Session</label>
              <input onChange={this.handleInputChange.bind(this, 'sessionName')} className="form-control" type="text" value={this.state.sessionName} required />
            </p>
            <p className="text-center">
              <input className="btn btn-lg btn-success" type="submit" name="commit" value="Join!" />
            </p>
          </form>
        </div>
      </div>
    );
  }

  renderVideoSession() {
    const { isActiveSession, sessionName } = this.state;
    if (!isActiveSession) {
      return null;
    }

    return(
      <div id="session">
        <div id="session-header">
          <h1 id="session-title">{sessionName}</h1>
          <input className="btn btn-large btn-danger" type="button" id="buttonLeaveSession" value="Leave session" />
        </div>
        <div id="main-video" className="col-md-6">
          <p>{this.state.username}</p>
          <video autoPlay></video>
        </div>
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
          {this.renderJoinDetails()}
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

export default connect(null, { getToken })(App);
