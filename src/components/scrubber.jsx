import React from "react";
import classnames from "classnames";
import { formatDuration } from "../utils";

export default class Scrubber extends React.Component {
  constructor(props) {
    super();
    this.state = {
      progress:       props.progress,
      targetProgress: props.progress,
      scrubbing:      false
    };
    this.stopScrubbingBound = this.stopScrubbing.bind(this);
  }

  componentDidMount() {
    window.addEventListener("mouseup", this.stopScrubbingBound);
  }

  componentWillUnmount() {
    window.removeEventListener("mouseup", this.stopScrubbingBound);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.scrubbing && !nextProps.seeking) {
      this.setState({
        targetProgress: nextProps.progress
      });
    }
  }

  scrubberClassNames() {
    return classnames("scrubber", this.props.className);
  }

  progress() {
    return (this.state.scrubbing || this.props.seeking)
      ? this.state.targetProgress
      : this.props.progress;
  }

  stopScrubbing() {
    this.setState({ scrubbing: false });
  }

  handleMouseDown(e) {
    this.setState({
      targetProgress: this.progressFromPosition(e.clientX),
      scrubbing:      true
    });
  }

  handleMouseUp() {
    this.stopScrubbing();
    this.props.onSeek(Math.round(this.state.targetProgress * this.props.duration));
  }

  handleMouseMove(e) {
    if (!this.state.scrubbing) return;
    this.setState({
      targetProgress: this.progressFromPosition(e.clientX)
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
