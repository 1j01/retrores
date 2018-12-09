const withPreact = require('@zeit/next-preact')

module.exports = withPreact({
	exportPathMap: function () {
		return {
			'/': { page: '/' }
		}
	}
})
