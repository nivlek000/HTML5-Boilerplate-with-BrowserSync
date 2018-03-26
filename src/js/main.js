import http from 'http';
//const http = require('http');
//Had to install Babel because import is not supported fully 
//npm install --save-dev babel-cli babel-preset-env

const fs = require('fs');
const formidable = require('formidable'); //file uploading
const os = require('os');

const hostname = '127.0.0.1';
const port = 3000;
const index_html = 'src/index.html';
const homedir = os.homedir();


fs.readFile(index_html, (err, data) => {
    if (err) {
        throw err;
    }

    const server = http.createServer((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/plain');
        res.write(data);
        res.end('Hello World');
    });

    server.listen(port, hostname, () => {
        console.log('Server started on port ' + port);
    });
});

//File system Manipulation
//append
fs.appendFile('mynewfile1.txt', 'Hello content! ' + new Date() + "\n", function (err) {
    if (err) throw err;
    console.log('Saved! 1');
});
//create
fs.open('mynewfile2.txt', 'w', function (err, file) {
    if (err) throw err;
    console.log('Saved! 2');
});

//create in home dir
fs.open(`${homedir}/learningnode_sample.txt`, 'w', function (err, file) {
    if (err) throw err;
    console.log('Saved! 2');
});
//delete
fs.unlink('mynewfile2.txt', function (err) {
    if (err) throw err;
    console.log('File deleted! 3');
});
//rename
fs.rename('mynewfile1.txt', 'myrenamedfile.txt', function (err) {
    if (err) throw err;
    console.log('File Renamed!');
});


//File uploading
http.createServer(function (req, res) {
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.filetoupload.path;
            var newpath = './uploads/' + files.filetoupload.name;
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.write('File uploaded and moved!');
                res.end();
            });
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    }
}).listen(8080, () => {
    console.log('Server started on port ' + 8080);
});

//Url module

const url = require('url'); //Url module
const adr = 'http://localhost:8080/default.htm?year=2017&month=february';
const q = url.parse(adr, true);

console.log(q.host); //returns 'localhost:8080'
console.log(q.pathname); //returns '/default.htm'
console.log(q.search); //returns '?year=2017&month=february'

var qdata = q.query; //returns an object: { year: 2017, month: 'february' }
console.log(qdata.month); //returns 'february'



//more URL
http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    fs.readFile(filename, function (err, data) {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            throw err;
            return res.end("404 Not Found");
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        return res.end();
    });
}).listen(8090, () => {
    console.log('Server started on port ' + 8090);
});


//Events
const events = require('events'); //events module
const eventEmitter = new events.EventEmitter();

//Create an event handler:
const myEventHandler = function () {
    console.log('I hear a scream!');
}

//Assign the event handler to an event:
eventEmitter.on('scream', myEventHandler);


//Fire the 'scream' event:
eventEmitter.emit('scream');

/*
//NodeMailer
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'yahoo',
    auth: {
        user: 'nivlek_000@yahoo.com',
        pass: 'Lb_sb_bb_1_yo'
    }
});

const mailOptions = {
    from: '"Fred Foo 👻" <sam@samsonmaconi.com>', // sender address
    to: 'nivlek000@gmail.com, baz@example.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>' // html body
};

console.log('aaaa');
mailOptions.html = fs.readFileSync(index_html, 'utf8'); //unlike readFile this doesnt take a call back function and it returns a value
console.log('bbbb');
transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);

        console.log('cccc');
    }
});
*/
