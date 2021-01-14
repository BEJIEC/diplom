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

ReactDOM.render(
	<StoreProvider {...stores}>
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</StoreProvider>,
	document.getElementById('root')
);
