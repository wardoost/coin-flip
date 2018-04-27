pragma solidity ^0.4.20;

contract CoinFlip {
  address public owner;
  uint public initiatorsCount;
  address[100] public initiators;

  struct Game {
    uint index;
    bool active;
    uint256 initiatorBet;
    uint256 amount;
  }

  mapping(address => Game) public games;

  event GameFinish (
    address initiator,
    address winner
  );

  function constuctor() public{
    owner = msg.sender;
    initiatorsCount = 0;
  }

  function kill() public {
    if(msg.sender == owner) selfdestruct(owner);
  }

  function getInitiatorsCount() public constant returns(uint) {
    return initiatorsCount;
  }

  function getInitiator (uint index) public constant returns(address) {
    return initiators[index];
  }

  function getInitiators () public constant returns(address[100]) {
    return initiators;
  }

  function addInitiator () public {
    initiators[initiatorsCount] = msg.sender;
  }

  function createGame(uint256 bet) public payable returns(uint index) {
    require(!games[msg.sender].active);
    require(bet >= 0 && bet <= 1);

    games[msg.sender].active = true;
    games[msg.sender].initiatorBet = bet;
    games[msg.sender].amount = msg.value;
    games[msg.sender].index = initiatorsCount;
    initiators[initiatorsCount] = msg.sender;
    initiatorsCount++;
    return initiatorsCount;
  }

  function checkGameActive(address initiator) public constant returns(bool){
    return games[initiator].active;
  }

  function checkGameAmount(address initiator) public constant returns(uint256){
    return games[initiator].amount;
  }

  function joinGame(address initiator) public payable {
    require(games[initiator].active);
    require(games[initiator].amount == msg.value);

    uint256 randomNumber = block.number % 2;

    if (games[initiator].initiatorBet == randomNumber) {
      initiator.transfer(games[initiator].amount * 2);
      emit GameFinish(initiator, initiator);
    } else {
      msg.sender.transfer(games[initiator].amount * 2);
      emit GameFinish(initiator, msg.sender);
    }

    resetGame(initiator);
  }

  // Send back funds to initiator and reset its games
  function stopGame() public {
    require(games[msg.sender].active);

    msg.sender.transfer(games[msg.sender].amount);
    resetGame(msg.sender);
  }

  function resetGame(address initiator) private {
    games[initiator].active = false;
    games[initiator].initiatorBet = 0;
    games[initiator].amount = 0;

    uint rowToDelete = games[initiator].index;
    address keyToMove = initiators[initiatorsCount - 1];
    initiators[rowToDelete] = keyToMove;
    games[keyToMove].index = rowToDelete; 
    initiatorsCount--;
  }

  // Fallback function in case someone sends ether to the contract so it doesn't get lost
  function() public payable {}
}
