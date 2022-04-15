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
    if(req.url=="/")
        fs.readFile('index.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });
}).listen(8080); 