import React, {Component, Fragment} from 'react'

export default class JoinGame extends Component {
  state = {
    initiator: ""
  }

  changeInitiator = event => {
    this.setState({initiator: event.target.value});
  }

  render() {
    return (
      <Fragment>
        <div className="input">
          <label>Who do you want to play against?</label>
          <input type="text" value={this.state.initiator} onChange={this.changeInitiator} placeholder="0x0000000000000000000000000000000000000000"/>
        </div>
        <div className="select">
          <button onClick={() => this.props.onCheckAddress(this.state.initiator)}>
            Check game status
          </button>
          <button
            onClick={() => this.props.onJoin(this.state.initiator, this.props.amount)}
            disabled={!this.props.active}>
            {typeof this.props.active === 'boolean' && !this.props.active
            ? 'No active game for this player'
            : `Flip a coin for ${this.props.amount} ether`}
          </button>
        </div>
      </Fragment>
    )
  }
}
