let simulated = new Date('2019-01-05T13:07:00'); // One minute before first real entry

function getSimulatedTime() {
  return simulated;
}

function advanceSimulatedTime(minutes = 1) {
  simulated = new Date(simulated.getTime() + minutes * 60000);
}

module.exports = {
  getSimulatedTime,
  advanceSimulatedTime
};
