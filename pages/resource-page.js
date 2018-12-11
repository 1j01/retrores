import {withRouter} from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import SharedHeadStuff from '../components/SharedHeadStuff.js'
import Header from '../components/Header.js'
import Footer from '../components/Footer.js'
import resources from '../catalog.js'

const getResourceById = (id)=>
	resources.find((resource)=> resource.id === id)

export default withRouter((props) => {
	const resource = getResourceById(props.router.query.id);
	return (
		<html>
			<Head>
				<title>{ resource.title } - Retrores - Windows 98 Resources</title>
			</Head>
			<SharedHeadStuff/>
			<body>
				<Header/>
				<main className="site-main">
					<div className="page-width-container">
						<h2>{ resource.title }</h2>
						<p>{ resource.description }</p>
						{ resource.files.map((file)=>
							<article className="resource-file">
								<a href={ file.path }>
									<h1>{ file.name }</h1>
									<img src={ file.path } />
								</a>
							</article>
						) }
						<ul className="tags tags-large">
							{ resource.tags.map((tag)=>
								<li className="tag">{ tag }</li>
							) }
						</ul>
						<nav className="return">
							<Link href="/">
								<a href="/" className="chevron left">Return to Resource Index</a>
							</Link>
						</nav>
					</div>
				</main>
				<Footer/>
			</body>
		</html>
	)
})
