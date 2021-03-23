import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import { readStream } from './helpers/getStream';

import './App.scss';

export default function App() {
	const [name, setName] = useState();
	const [onfile, setFile] = useState(false);
	const [files, setFiles] = useState(false);
	const imgRef = useRef();
	const aRef = useRef();

	const send = () => {
		const data = new FormData();
		if (onfile) data.append('file', onfile);
		if (files) for (const file of files) data.append('attachments', file);
		if (name) data.append('name', name);

		axios
			.post('http://localhost:4000/upload', data)
			.then((res) => {
				setFile(false);
				setFiles(false);
			})
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		fetch(new Request('http://localhost:4000/file/820552fc-3163-4152-ab7b-bd297c074260.jpg', { method: 'GET' }))
			.then(async (response) => {
				const data = await readStream(response.body);
				imgRef.current.src = URL.createObjectURL(new Blob(data));
				aRef.current.href = URL.createObjectURL(new Blob(data));
				aRef.current.download = 'name.jpg';
			})
			.catch((err) => console.log(err));
	}, []);

	return (
		<div className='container'>
			<div className='row'>
				<div className='col-4'>
					<form>
						<div>
							<label htmlFor='name'>Name</label>
							<input
								type='text'
								id='name'
								onChange={(event) => {
									const { value } = event.target;
									setName(value);
								}}
								required
							/>
						</div>
						<br />
						<div>
							<label htmlFor='file'>One file</label>
							<input type='file' id='file' accept='.png, .jpg, .jpeg .svg' onChange={(event) => setFile(event.target.files[0])} />
						</div>
						<br />
						<div>
							<label htmlFor='file'>Files</label>
							<input type='file' id='file' multiple accept='.png, .jpg, .jpeg .svg' onChange={(event) => setFiles(event.target.files)} />
						</div>
					</form>
					<br />
					<button onClick={send}>Send</button>
					<br />
					<br />
					<a ref={aRef} href={'/#'}>
						download
					</a>
				</div>
				<div className='offset-4 col-4'>
					<img className='w-100' ref={imgRef} id='selfie' src={''} alt='not found!' />
				</div>
			</div>
		</div>
	);
}
