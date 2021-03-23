const fs = require('fs');

module.exports = async (derictory) => {
	try {
		const stat = await fs.promises.lstat(derictory);
		return stat.isDirectory();
	} catch (error) {
		return fs.mkdirSync(derictory);
	}
};
