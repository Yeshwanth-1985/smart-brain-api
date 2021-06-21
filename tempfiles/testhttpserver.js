const http = require('http');

const server = http.createServer((request, response) => {
	console.log('headers', request.headers);
	console.log('methods', request.method);
	console.log('url123', request.url);
	const user = {
		name: "yeshwanth",
		password: "rgukt123"
	}
	response.setHeader('Content-Type','application/json');
	response.end(JSON.stringify(user));
})

server.listen(3000);