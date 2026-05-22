import 'styled-components';

declare module 'styled-components' {
	export interface DefaultTheme {
		textColor: string;
		mutedTextColor: string;
		bgColor: string;
		accentColor: string;
		accentTextColor: string;
		listColor: string;
		panelColor: string;
		borderColor: string;
		softBorderColor: string;
		badgeBgColor: string;
		positiveColor: string;
		negativeColor: string;
		chartColor: string;
		shadow: string;
	}
}
