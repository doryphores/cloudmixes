import React from 'react';
import classnames from 'classnames';

const Toolbar = ({ className }) => (
  <header className={classnames("toolbar u-flex u-flex--horizontal", className)}>
    <h1 className="u-flex__panel u-flex__panel--grow">Cloud mixes</h1>
  </header>
);

export default Toolbar;
