import type { RouterOnChangeArgs } from 'preact-router'
import { Router } from 'preact-router'
import '../styles/global.css'
import '../styles/nodes.css'
import { Analytics } from './Analytics.js'
import { Header } from './components/index.js'
import { Changelog, Convert, Customized, Generator, Generators, Guide, Guides, Home, LegacyPartners, Partners, Sounds, Transformation, Versions, WhatsNew, Worldgen } from './pages/index.js'
import { cleanUrl } from './Utils.js'

declare var __SITE_URL__: string

function updateCanonical(path: string) {
	let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
	if (!link) {
		link = document.createElement('link')
		link.rel = 'canonical'
		document.head.appendChild(link)
	}
	link.href = `${__SITE_URL__}${path}`
}

export function App() {
	const changeRoute = (e: RouterOnChangeArgs) => {
		window.dispatchEvent(new CustomEvent('replacestate'))
		const path = cleanUrl(e.url)
		updateCanonical(path)
		// Needs a timeout to ensure the title is set correctly
		setTimeout(() => Analytics.pageview(path))
	}

	return <>
		<Header />
		<Router onChange={changeRoute}>
			<Home path="/" />
			<Generators path="/generators" />
			<Worldgen path="/worldgen" />
			<Partners path="/partners" />
			<LegacyPartners path="/partners/:id" />
			<Sounds path="/sounds" />
			<Changelog path="/changelog" />
			<Versions path="/versions" />
			<Transformation path="/transformation" />
			<Customized path="/customized" />
			<Convert path="/convert" />
			<Convert path="/convert/:formats" />
			<WhatsNew path="/whats-new" />
			<Guides path="/guides" />
			<Guide path="/guides/:id" />
			<Generator default />
		</Router>
	</>
}
