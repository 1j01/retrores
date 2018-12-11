# [![Retrores](static/logo/retrores-green-pink-glowy.png)](https://retrores.fairuse.org/)
A catalog of cursors and icons from Windows 98, in original and modern formats

There are 3 items in the catalog so far. Humble beginnings :)

[View it here](https://retrores.fairuse.org/)

## Planned

* Tons and tons of resources
	* Automate extraction and conversion to various formats
* JSON metadata, which could be considered an API
	* Rich information like what DLL or EXE a file came from and the index within that source file, the operating system version it was retrieved from, copyright, etc.
* An interface for browsing icons and cursors on the web
	* Search (by name, description, and tags which can be progressively added)
	* Preview cursors as cursors
	* Download files or copy base64 data URI
* Host resources on the distributed web with Dat, IPFS, and/or WebTorrent

## Development Setup

* [Install Node.js](https://nodejs.org/en/) if you don't have it already.

* [Install Git LFS](https://help.github.com/articles/installing-git-large-file-storage/) if you don't have it already.

* [Clone the repo.](https://help.github.com/articles/cloning-a-repository/)

* In a terminal / command prompt in the repo directory, run `npm i` to install dependencies.

The site is built with [Next.js](https://nextjs.org/), which gives us hot module replacement and client-side routing, altho I've had to put an unexpected amount of effort into making the development server match production.

Run `npm run dev` to start the development server, and open `http://localhost:3000` in your browser.

Run `npm run build` to build and export a static site to `out/` - this is what's deployed to [Netlify](https://www.netlify.com/).
