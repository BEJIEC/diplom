import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider } from 'styled-components';
import { Provider as StoreProvider } from 'mobx-react';
import './index.css';

ReactDOM.render(
	<StoreProvider>
		<ThemeProvider>
			<React.StrictMode>
				<App />
			</React.StrictMode>
		</ThemeProvider>
	</StoreProvider>,
	document.getElementById('root')
);
