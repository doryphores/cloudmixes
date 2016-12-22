import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { REFRESH_TRACKS } from '../actions';

const Toolbar = ({ onRefreshClick, className }) => (
  <header className={classnames("toolbar u-flex u-flex--horizontal", className)}>
    <h1 className="u-flex__panel u-flex__panel--grow">Cloud mixes</h1>
    <button onClick={onRefreshClick}>Refresh</button>
  </header>
);

function mapStateToProps(state) {
  return Object.assign({}, state.player, {
    track: state.tracks.find(t => t.id == state.player.trackID)
  });
}

function mapDispatchToProps(dispatch) {
  return {
    onRefreshClick: () => dispatch({ type: REFRESH_TRACKS })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
