import React, { useContext, createContext, useState } from 'react'
import { ThemeProvider } from '@material-ui/core/styles';
import { DefaultTheme } from './default'

const ThemeContext = createContext();

export const useTheme = () => {
	const ctx = useContext(ThemeContext);
	if (ctx === undefined) {
		throw new Error('you need to call useTheme inside of ThemeProvider')
	}
	return ctx
}

export const CustomThemeProvider = props => {

	const [ theme, setTheme ] = useState(DefaultTheme)

	return (
		<ThemeContext.Provider value={theme}>
			<ThemeProvider theme={theme}>
				{props.children}
			</ThemeProvider>
		</ThemeContext.Provider>
	)
}