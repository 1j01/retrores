const withPreact = require('@zeit/next-preact')
const resources = require('./catalog.js')

module.exports = withPreact({
	// This is NOT only used during export
	exportPathMap: ()=> {
		const pathMap = {
			'/': { page: '/' }
		}
		resources.forEach((resource)=> {
			pathMap[resource.pagePath] = {
				page: '/resource-page',
				query: { id: resource.id },
			}
		})
		return pathMap
	}
})
