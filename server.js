require('@zeit/next-preact/alias')()
const { createServer } = require('http')
// const express = require('express')
const next = require('next')
const resources = require('./catalog.js')

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
})

// app.prepare()
// .then(() => {
// 	const server = express()

// 	server.get('*', (req, res) => {
// 		return handle(req, res)
// 	})

// 	server.listen(3000, (err) => {
// 		if (err) throw err
// 		console.log('> Ready on http://localhost:3000')
// 	})
// })
// .catch((ex) => {
// 	console.error(ex.stack)
// 	process.exit(1)
// })
