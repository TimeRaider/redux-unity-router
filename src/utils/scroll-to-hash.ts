type ScrollToHash = (hash?: string) => void;

const scrollToHash: ScrollToHash = hash =>
	hash &&
	document &&
	Promise.resolve(() => {
		const node = document.getElementById(hash.substr(1));
		if (node) {
			node.scrollIntoView();
		}
	});

export default scrollToHash;
