require('@zeit/next-preact/alias')()
const { createServer } = require('http')
// const express = require('express')
const next = require('next')
const resources = require('./catalog.js')
// TODO: hot-reload resources list?

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000

const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
	createServer(handle)
	.listen(port, () => {
		console.log(`> Ready on http://localhost:${port}`)
	})

	// const server = express()

	// // server.get('/:id/:name-slug', (req, res) => {
	// // 	const actualPage = '/resource-page'
	// // 	const queryParams = { id: req.params.id } 
	// // 	app.render(req, res, actualPage, queryParams)
	// // })

	// server.get('*', (request, response) => {
	// 	return handle(request, response)
	// })

	// server.listen(port, (error) => {
	// 	if (error) throw error
	// 	console.log(`> Ready on http://localhost:${port}`)
	// })
})
.catch((error) => {
	console.error(error.stack)
	process.exit(1)
})
