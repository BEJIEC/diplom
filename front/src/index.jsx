import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider as StoreProvider } from 'mobx-react';

import 'fontsource-roboto';
import './index.css';

import AppStore from './stores/AppStore';

const stores = {
	appStore: new AppStore()
}

async function initApp() {

	await stores.appStore.getSettings();

	ReactDOM.render(
		<StoreProvider {...stores}>
			<React.StrictMode>
				<App />
			</React.StrictMode>
		</StoreProvider>,
		document.getElementById('root')
	);

}

initApp();
