const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);
const { v4: uuidv4 } = require('uuid');

const { cpUpload } = require('./helpers/multer');
const createDerictory = require('./helpers/createDerictory');
const getListFile = require('./helpers/getListFile');

const app = express();

app.use(cors('*'));

app.post('/upload', cpUpload, async (req, res) => {
	try {
		const file = req.files.file[0];
		const files = req.files.attachments;
		const name = req.body.name;
		if (!name) return res.status(400).json({ msg: `Name is require!` });

		await createDerictory(`${__dirname}/./public/images`).catch((e) => e);
		await createDerictory(`${__dirname}/./public/images/${name}`).catch((e) => e);

		if (file) {
			if (!file) return res.status(400).json({ msg: `File is require!` });
			const fileName = `${uuidv4()}${file.detectedFileExtension}`;
			await pipeline(file.stream, fs.createWriteStream(`${__dirname}/./public/images/${name}/${fileName}`));
		}

		if (files) {
			if (files.length === 0) return res.status(400).json({ msg: `File is require!` });
			files.forEach(async (element) => {
				const fileName = `${uuidv4()}${element.detectedFileExtension}`;
				await pipeline(element.stream, fs.createWriteStream(`${__dirname}/./public/images/${name}/${fileName}`));
			});
		}
		return res.status(200).json({ msg: 'File uploadeds success!' });
	} catch (err) {
		return res.status(400).json({ msg: err.message });
	}
});

app.get('/get-list-files/:detected', async (req, res) => {
	try {
		if (req.params.detected) return res.status(400).json({ msg: `Detected name is require!` });
		let list = getListFile(req.params.detected).catch((e) => e);
		list = list.filter((item) => item !== 'arrey');
		return res.status(200).json({ data: list, msg: 'File uploadeds success!' });
	} catch (err) {
		return res.status(400).json({ msg: err.message });
	}
});

app.get('/file/:name', (req, res) => {
	if (!req.params.name) return res.status(400).json({ msg: `File name is require!` });
	const file = fs.createReadStream(`${__dirname}/./public/images/Василь/${req.params.name}`);
	file
		.pipe(res)
		.on('finish', () => console.log('File send finish!'))
		.on('error', (err) => res.status(400).json({ msg: err.message }));
});

app.listen(4000, (err) => (err ? console.error(err) : console.log('Example app listening on port http://localhost:4000!')));
