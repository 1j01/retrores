import Head from 'next/head'

export default class Header extends React.Component {
	render() {
		return (
			<header class="site-header">
				<h1 class="site-title">
					<a href="/">
						<span class="logo-image-text">Retrores</span>
						{/*
						<img
							src="/static/logo/retrores-green-pink-no-glow-no-reflection-no-outline-cropped.png"
							width="434" height="105" style={{marginBottom: 105}} alt=""
						/>
						<img
							src="/static/logo/retrores-green-pink-glowy.png"
							width="450" height="143" style={{marginBottom: 143}} alt=""
						/>
						*/}
						<img
							src="/static/logo/retrores-green-pink-no-glow.png"
							width="450" height="143" style={{marginBottom: 143}} alt=""
						/>
						{/* margin-bottom on img makes room for the reflection effect, same height as img */}
					</a>
				</h1>
				<Head>
					<script src="/static/lib/lake.js"></script>
				</Head>
			</header>
		)
	}
	componentDidMount() {
		lake(document.querySelector(".site-title img"));
	}
	componentWillUnmount() {
		// TODO: clean up lake effect
	}
}
