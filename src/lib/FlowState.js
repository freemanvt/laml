class FlowState {
  constructor() {
    this.nextStatus = false;
    this.endStatus = false;
  }

  next() {
    this.nextStatus = true;
  }

  reset() {
    this.nextStatus = false;
  }

  endStatus() {
    this.endStatus = true;
  }
}

module.exports = FlowState;