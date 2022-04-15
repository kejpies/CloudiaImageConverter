/*
Cloudia Image Converter
Copyright (C) 2022 Konrad Sekuła

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const Jimp = require("jimp");

http.createServer(function (req, res) {
    if(req.url=="/upload"){
        if(req.method.toLowerCase() == 'post'){
            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                if(['jpeg','png','bmp','tiff'].includes(fields.to_format)){
                    var path = files.imagefile.filepath;
                    res.writeHead(200, {
                        'Server':'Cloudia/1.0',
                        'ContentType': 'application/octet-stream',
                        'Content-Disposition':'attachment; filename='+
                            files.imagefile.originalFilename+"."+fields.to_format
                    });
                    const buffer = fs.readFileSync(path);
                    Jimp.read(buffer, function(err,image){
                        image.getBuffer("image/"+fields.to_format,(err,resource)=>{
                            console.log(resource);
                            res.write(resource,'binary');
                            return res.end(null,'binary');
                        });
                    });
                } else {
                    res.writeHead(302,{
                        'Location':'/'
                    });
                    return res.end();
                }
            });
        } else {
            res.writeHead(302,{
                'Location':'/'
            });
            return res.end();
        }
    }
    else if(req.url=="/")
    {
        fs.readFile('index.html', function(err, data) {
            res.writeHead(200, {'Server':'Cloudia/1.0', 'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });
    }
    else{
        res.writeHead(404, {'Server':'Cloudia/1.0', 'Content-Type': 'text/html'});
        res.write('<h1>404 Not Found</h1>');
        return res.end();
    }
}).listen(8080); 