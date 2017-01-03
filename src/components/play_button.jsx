import React from 'react'
import classnames from 'classnames'

const PlayButton = ({ className, onClick, size, playing, waiting }) => (
  <div className={buttonClassNames({ className, size, waiting })}
    onClick={onClick.bind(this)}>
    <i className='play-button__icon material-icons'>
      {playing ? 'pause' : 'play_arrow'}
    </i>
    <span className='play-button__dots' />
  </div>
)

function buttonClassNames ({ className, size, waiting }) {
  return classnames(
    className,
    'play-button',
    'u-flex u-flex--vertical u-flex--center u-flex--vertical-center',
    `play-button--${size}`,
    {
      'play-button--waiting': waiting
    }
  )
}

export default PlayButton
