export const readStream = (stream) => {
	const reader = stream.getReader();
	let result = [];
	return reader
		.read()
		.then(function processText({ done, value }) {
			if (done) return result;
			result.push(value);
			return reader.read().then(processText);
		})
		.catch((err) => console.error(err));
};
