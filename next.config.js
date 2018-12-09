const withPreact = require('@zeit/next-preact')
const resources = require('./catalog.js')

module.exports = withPreact({
	exportPathMap: function () {
		return {
			'/': { page: '/' }
		}
	}
})
