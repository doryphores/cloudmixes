import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { SAVE_SETTINGS } from '../actions'

class SettingsPanel extends React.Component {
  constructor (props) {
    super()
    this.state = {
      minTrackLength: props.minTrackLength,
      open: props.minTrackLength === ''
    }
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.onSubmit({
      minTrackLength: this.state.minTrackLength
    })
    this.toggle()
  }

  handleInputChange (propName, e) {
    this.setState({ [propName]: e.target.value })
  }

  toggle () {
    this.setState({ open: !this.state.open })
  }

  classNames () {
    return classnames('settings', this.props.className, {
      'settings--open': this.state.open
    })
  }

  render () {
    return (
      <div className={this.classNames()}>
        <header className='settings__header u-flex u-flex--horizontal'>
          <h1 className='u-flex__panel u-flex__panel--grow'>
            <i className='material-icons'>cloud_circle</i>
            Cloud mixes
          </h1>
          <span className='settings__toggle material-icons'
            onClick={this.toggle.bind(this)}>
            settings
          </span>
        </header>
        <form className='settings__panel u-flex u-flex--vertical'
          onSubmit={this.handleSubmit.bind(this)}>
          <label className='field u-flex__panel'>
            <span className='field__label'>
              Minimum SoundCloud track length (in minutes)
            </span>
            <input className='field__input'
              type='number'
              required
              pattern='\d+'
              value={this.state.minTrackLength}
              onChange={this.handleInputChange.bind(this, 'minTrackLength')} />
          </label>
          <footer className='form-actions'>
            <button className='button'>Apply</button>
          </footer>
        </form>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return state.settings
}

function mapDispatchToProps (dispatch) {
  return {
    onSubmit: (settings) => dispatch({
      type: SAVE_SETTINGS,
      payload: settings
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPanel)
