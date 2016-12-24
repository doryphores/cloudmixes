import React from 'react';
import classnames from 'classnames';

export default class PlayButton extends React.Component {
  buttonClassNames() {
    return classnames(
      this.props.className,
      'play-button',
      'u-flex u-flex--vertical u-flex--center u-flex--vertical-center',
      `play-button--${this.props.size}`,
      {
        'play-button--waiting': this.props.waiting
      }
    );
  }

  render() {
    return (
      <div className={this.buttonClassNames()}
        onClick={this.props.onClick.bind(this)}>
        <i className="play-button__icon material-icons md-36">
          {this.props.playing ? "pause" : "play_arrow"}
        </i>
        <span className="play-button__dots" />
      </div>
    );
  }
}
