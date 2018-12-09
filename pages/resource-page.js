import Head from 'next/head'
import SharedHeadStuff from '../components/SharedHeadStuff.js'
import Header from '../components/Header.js'
import Footer from '../components/Footer.js'
import resources from '../catalog.js'

export default (props) =>
	<html>
		<Head>
			<title>{ props.title } - Retrores - Windows 98 Resources</title>
		</Head>
		<SharedHeadStuff/>
		<body>
			<Header/>
			<main class="site-main">
				<div class="page-width-container">
					<h2>{ props.title }</h2>
					<p>{ props.description }</p>
					{props.files.map((file)=>
						<article class="resource-file">
							<a href="{ file.path }">
								<h1>{ file.name }</h1>
								<img src="{ file.path }" />
							</a>
						</article>
					) 
					<ul class="tags tags-large">
						{tags.map((tag)=>
							<li class="tag">{ tag }</li>
						) }
					</ul>
					<nav class="return">
						<a href="/" class="chevron left">Return to Resource Index</a>
					</nav>
				</div>
			</main>
			<Footer/>
		</body>
	</html>
