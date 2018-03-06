/*
 * Simple HTTP server to output some data.
 */
const   http        = require('http'),
        os          = require('os'), 
        fs          = require('fs'), 
        uuid        = require('uuid'),
        colour      = require('randomcolor'),
        Handlebars  = require('handlebars'),
        moment      = require('moment'),
        port        = process.env.PORT || 3000;
        

class HelloWorldServer {
    
    constructor () {
        
        this.startTime  = new Date().getTime(); 
        this.instance   = uuid.v4();
        this.colour     = colour();
        this.html       = fs.readFileSync('files/index.htm', 'utf8'); 
        this.template   = Handlebars.compile(this.html);
        this.server     = this.startServer();
        
        //
        this.server.listen(port, (err) => {
            if (err) {
                return console.error(`hello-world raised an exception: ${err}`);
            }
            console.log(`hello-world is listening on port ${port}`)
        });
    }
    
    startServer () {
        
        let server = http.createServer((request, response)=>{
            
            let data = {
                    platform:   os.platform(),
                    hostname:   os.hostname(),
                    instance:   this.instance,
                    colour:     this.colour,
                    env:        this.getEnvironment(),
                    localTime:  moment().format(),
                    utcTime:    moment.utc().format(),
                    uptime:     this.getUptime()
                },
                html = this.template(data);
            
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(html);
            response.end();
        });
        
        return server;
    }
    
    getUptime () {
        
        let now  = new Date().getTime();
        return moment.duration(now - this.startTime).humanize();
    }
    
    getEnvironment () {
        
        let keys = Object.keys(process.env);
        return keys.sort((a, b)=>{
                return a.localeCompare(b);
            }).map((e)=>{
                return `<strong>${e}</strong>: ${process.env[e]}`;
            }).join('\n');
    }
}

// handle SIGINT properly
process.on('SIGINT', function() {
    process.exit();
});

new HelloWorldServer();