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
}
module.exports.struct = new TarkovSend();