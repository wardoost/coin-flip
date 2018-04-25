import React, {Component, Fragment} from 'react'
import Web3 from 'web3'

import {abi} from '../build/contracts/CoinFlip.json'
import CreateGame from './components/CreateGame'
import JoinGame from './components/JoinGame'

export default class App extends Component {
  constructor(props){
    super(props)

    if(typeof web3 != 'undefined'){
      console.log("Using web3 detected from external source like Metamask")
      this.web3 = new Web3(web3.currentProvider)
   } else {
      this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
   }

    this.state = {
      gameType: null,
      gameActive: null,
      gameAmount: null,
      contract: web3.eth.contract(abi).at(process.env.CONTRACT_ADDRESS),
      initiator: '',
      winner: '',
    }
  }

  componentDidMount() {
    this.state.contract.GameFinish((error, result) => {
      console.log('GameFinish', error, result);

      if (result) {
        const {initiator, winner} = result.args

        if (initiator === this.state.gameType === 'create' ? web3.eth.accounts[0] : this.state.initiator) {
          this.setState({winner})
        }
      }
    })
  }

  createGame = (amount, bet = 0) => {
    this.setState({initiator: web3.eth.accounts[0]})
    
    this.state.contract.createGame(bet, {
      gas: 300000,
      from: web3.eth.accounts[0],
      value: web3.toWei(amount, 'ether')
    }, (error, result) => {
      console.log(error, result)
    })
  }

  joinGame = (initiator, amount) => {
    this.setState({initiator})

    this.state.contract.joinGame(initiator, {
      gas: 300000,
      from: web3.eth.accounts[0],
      value: web3.toWei(amount, 'ether')
    }, (error, result) => {
      console.log(error, result)
    })
  }

  checkGame = address => {    
    this.state.contract.checkGameActive(address, (error, resultActive) => {
      console.log(error, resultActive)

      if (resultActive) {
        this.state.contract.checkGameAmount(address, (error, resultAmount) => {
          console.log(error, resultAmount)

          this.setState({
            gameActive: resultActive,
            gameAmount: Number(web3.fromWei(resultAmount.toNumber(), 'ether'))
          })
        })
      } else {
        this.setState({
          gameActive: resultActive,
        })
      }
      })
  }

  render() {
    console.log(this.state)
    return (
      <div className="container">
        <h1>Coin Flip</h1>
        {!this.state.gameType
          ? <div className="select">
            <button onClick={() => this.setState({gameType: 'create'})}>
              Create a Game
            </button>
            <button onClick={() => this.setState({gameType: 'join'})}>
              Join a Game
            </button>
          </div>
          : <Fragment>
            {this.state.winner 
              ? <p>{this.state.winner === web3.eth.accounts[0]
                ? 'You have won :)'
                : 'You lost :('}</p>
              : this.state.gameType === 'create'
                ? <CreateGame onCreate={this.createGame} />
                : <JoinGame
                  onJoin={this.joinGame}
                  onCheckAddress={this.checkGame}
                  active={this.state.gameActive}
                  amount={this.state.gameAmount}
                />}
            <button onClick={() => this.setState({gameType: null})} className="back">
              {'<'} back
            </button>
          </Fragment>}
      </div>
    )
  }
}
