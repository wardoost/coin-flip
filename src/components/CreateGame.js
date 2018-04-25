import React, {Component, Fragment} from 'react'

export default class CreateGame extends Component {
  state = {
    amount: 1
  }

  changeAmount = event => {
    this.setState({amount: Number(event.target.value)});
  }

  render() {
    return (
      <Fragment>
        <div className="input">
          <label>Amount of ether you want to play for</label>
          <input type="text" value={String(this.state.amount)} onChange={this.changeAmount} placeholder="" type="number" />
        </div>
        <div className="select">
          <button onClick={() => this.props.onCreate(this.state.amount, 0)}>
            Heads
          </button>
          <button onClick={() => this.props.onCreate(this.state.amount, 1)}>
            Tails
          </button>
        </div>
      </Fragment>
    )
  }
}
