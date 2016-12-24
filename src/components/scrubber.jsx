import React from 'react';
import classnames from 'classnames';
import { formatDuration } from '../utils';

export default class Scrubber extends React.Component {
  constructor() {
    super();
    this.state = {
      progress: 0,
      scrubbing: false
    };
    this.cancelScrubBound = this.cancelScrub.bind(this);
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.cancelScrubBound);
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.cancelScrubBound);
  }

  scrubberClassNames() {
    return classnames('scrubber', this.props.className);
  }

  progress() {
    return (this.state.scrubbing || this.props.seeking) ? this.state.progress : this.props.progress;
  }

  cancelScrub() {
    this.setState({ scrubbing: false });
  }

  handleMouseDown(e) {
    this.setState({
      progress: this.progressFromPosition(e.clientX),
      scrubbing: true
    });
  }

  handleMouseUp() {
    this.cancelScrub();
    this.props.onSeek(Math.round(this.state.progress * this.props.duration));
  }

  handleMouseMove(e) {
    if (!this.state.scrubbing) return;
    this.setState({
      progress: this.progressFromPosition(e.clientX)
    });
  }

  progressFromPosition(clientX) {
    clientX -= this.refs.scrubber.getBoundingClientRect().left;
    return clientX / this.refs.scrubber.offsetWidth;
  }

  render() {
    return (
      <div ref="scrubber"
        className={this.scrubberClassNames()}
        style={{ backgroundSize: `${this.progress() * 100}% 100%` }}
        onMouseDown={this.handleMouseDown.bind(this)}
        onMouseUp={this.handleMouseUp.bind(this)}
        onMouseMove={this.handleMouseMove.bind(this)}>
        {this.props.children}
        <span className="player__progress">
          {formatDuration(this.props.duration * this.progress())}
        </span>
      </div>
    );
  }
}
