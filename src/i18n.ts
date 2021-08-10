
// On change of language, switch the /locals/_language_.json file
export function loadLocaleMessages() {
	// @ts-ignore
	const locales = require.context(
		"./locales",
		true,
		/[A-Za-z0-9-_,\s]+\.json$/i
	);
	const messages = {};
	locales.keys().forEach((key) => {
		const matched = key.match(/([A-Za-z0-9-_]+)\./i);
		if (matched && matched.length > 1) {
			const locale = matched[1];
			messages[locale] = locales(key);
		}
	});
	return messages;
}

// Detect default language of browser, and apply it on start
export function detectLanguage() {
	const lng = window.navigator.language;
	// @ts-ignore
	const locales = require.context(
		"./locales",
		true,
		/[A-Za-z0-9-_,\s]+\.json$/i
	);
	const lang = locales
		.keys()
		.find((key) => lng.includes(key.replace("./", "").replace(".json", "")));
	return lang ? lang.replace("./", "").replace(".json", "") : null;
}
