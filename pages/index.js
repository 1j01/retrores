import Link from 'next/link'
import Head from 'next/head'
import SharedHeadStuff from '../components/SharedHeadStuff.js'
import Header from '../components/Header.js'
import Footer from '../components/Footer.js'
import resources from '../catalog.js'

export default () =>
	<html>
		<Head>
			<title>Retrores - Windows 98 Resources</title>
		</Head>
		<SharedHeadStuff/>
		<body>
			<Header/>
			<main class="site-main">
				<div class="page-width-container">
					<h2>Resource Index</h2>
					{resources.map((resource)=>
						<article class="resource">
							<Link href={`/resource-page?id=${encodeURIComponent(resource.id)}`} as={ resource.pagePath }>
								<a href={ resource.pagePath }>
									<h1>{ resource.title }</h1>
									<img src={ resource.files[1].path } />
								</a>
							</Link>
							<p>{ resource.description }</p>
							<ul class="tags tags-small">
								{resource.tags.map((tag)=>
									<li class="tag">{ tag }</li>
								)}
							</ul>
						</article>
					)}
				</div>
			</main>
			<Footer/>
		</body>
	</html>
