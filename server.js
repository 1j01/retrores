require('@zeit/next-preact/alias')()
const { createServer } = require('http')
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
})
.catch((error) => {
	console.error(error.stack)
	process.exit(1)
})
