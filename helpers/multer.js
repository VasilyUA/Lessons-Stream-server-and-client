const multer = require('multer')();

exports.cpUpload = multer.fields([
	{ name: 'file', maxCount: 1 },
	{ name: 'attachments', maxCount: 8 },
]);

exports.arrFiles = multer.array('files[]', 2);

exports.oneFile = multer.single('file');
