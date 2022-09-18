import type { MetaFunction, LinksFunction } from '@remix-run/cloudflare';
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from '@remix-run/react';
import type { ErrorBoundaryComponent } from '@remix-run/react/dist/routeModules';
import styles from './gen-styles/app-generated-do-not-edit.css';

export const meta: MetaFunction = () => ({
	charset: 'utf-8',
	// Customize the title with your chatbot's name
	title: 'Talk to [Oz]',
	viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: styles },
	{ rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
	{
		rel: 'icon',
		type: 'image/png',
		sizes: '32x32',
		href: '/favicon-32x32.png',
	},
	{
		rel: 'icon',
		type: 'image/png',
		sizes: '16x16',
		href: '/favicon-16x16.png',
	},
	{ rel: 'manifest', href: '/site.webmanifest' },
];

export default function App() {
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<div className="flex flex-col items-center justify-start w-full h-screen">
					<div className="flex w-full md:max-w-md h-screen md:h-auto flex-col items-center text-center justify-start py-8 px-4">
						Oops! There was an error:
						<span className="text-red-500">{error.message}</span>
						Please reload the page.
					</div>
				</div>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
};
