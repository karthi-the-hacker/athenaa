#!/usr/bin/env node

/**
 * Athenaa
 * A Bugbounty automation tool for splitting endpoints from recon data
 *
 * @author karthikeyan V (karthithehacker) <https://karthithehacker.com>
 */

//lib and includes section 
const url = require('url');
var fs = require('fs');
const lineReader = require('line-reader');
//lib and includes section 


//Constractor class 
class loader {
    constructor(path,save) {
        function readUrls() {
        return new Promise((resolve, reject) => {
            let urlParts = [];
            lineReader.eachLine(path, (line, last) => {
            const urlString = line;
            const parsedUrl = url.parse(urlString);
            
            if (parsedUrl.pathname !== null) {
                const pathArray = parsedUrl.pathname.split('/');
                pathArray.shift(); 
            const parts = pathArray.map((part, index) => {
                return parsedUrl.protocol + '//' + parsedUrl.hostname + '/' + pathArray.slice(0, index + 1).join('/') + '/';
            });
            urlParts = urlParts.concat(parts);
            if (last) {
                resolve(urlParts);
            }
            }
            });
        
        });
        }
        readUrls().then((urlParts) => {
            const uniqueUrls = Array.from(new Set(urlParts.map(url => url.trim())));
            console.log(Array.from(uniqueUrls).join('\n'));
            if(save == null || save == true){
                return;     
            }
            else{
                uniqueUrls.forEach(element => {
                    fs.appendFileSync(save, element+"\n", function (err) {
                        if (err) throw err;
                        });
                    })
            }     
        }).catch((error) => {
        console.error(error);
        });
 }
}
//Exporting the modules
module.exports = {
    engine: loader
}
