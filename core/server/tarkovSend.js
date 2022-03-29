class TarkovSend {
    constructor() {
        this.mime = {
            html: "text/html",
            txt: "text/plain",
            jpg: "image/jpeg",
            png: "image/png",
            css: "text/css",
            otf: "font/opentype",
            json: "application/json",
        };
    }

    zlibJson(resp, output, sessionID) {
        let Header = {"Content-Type": this.mime["json"], "Set-Cookie": "PHPSESSID=" + sessionID };
        // this should enable content encoding if you ask server from web browser
        if(typeof sessionID == "undefined"){
            Header["content-encoding"] = "deflate";
        }
        resp.writeHead(200, "OK", Header);
        internal.zlib.deflate(output, function (err, buf) {
        resp.end(buf);
        });
    }

    txtJson(resp, output) {
        resp.writeHead(200, "OK", { "Content-Type": this.mime["json"] });
        resp.end(output);
    }

    html(resp, output) {
        resp.writeHead(200, "OK", { "Content-Type": this.mime["html"] });
        resp.end(output);
    }

    file(resp, file) {
        const _split = file.split(".");
        let type = this.mime[_split[_split.length - 1]] || this.mime["txt"];
        let fileStream = fileIO.createReadStream(file);

        fileStream.on("open", function () {
        resp.setHeader("Content-Type", type);
        fileStream.pipe(resp);
        });
    }

    sendStaticFile(req, resp){
        if (req.url == "/favicon.ico") {
            this.file(resp, "res/icon.ico");
            return true;
        }
        if (req.url.includes(".css")) {
            this.file(resp, "res/style.css");
            return true;
        }
        if (req.url.includes("bender.light.otf")) {
            this.file(resp, "res/bender.light.otf");
            return true;
        }
    
        if (req.url.includes("/server/config")) {
            //make a different response for static html pages
            // load html page represented by home_f
            //output = router.getResponse(req, body, sessionID);
            //this.tarkovSend.html(resp, output, "");
            return true;
        }
        if (req.url.includes("/html/")) {
            //make a different response for static html pages
            // load html page represented by home_f
            let output = router.getResponse(req, "", "");
            this.html(resp, output, "");
            return true;
        }
        if (req.url == "/") {
            //home_f.processSaveData(body);
            // its hard to create a file `.js` in folder in windows cause it looks cancerous so we gonna write this code here
            this.html(resp, home_f.RenderHomePage(), "");
            return true;
        }
        return false;
    }
}
module.exports.struct = new TarkovSend();