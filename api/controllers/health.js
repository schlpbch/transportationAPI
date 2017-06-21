'use strict'

module.exports = {
  status
}

function status (req, res) {
  let now = new Date()
  // TODO:
  //  - return a real JSON object
  //  - distinguish between the version of the API and its implementation
  let version = '0.0.14'
  res.json("{ status: 'ok', date: '" + now + "', version: '" + version + "'}")
}
