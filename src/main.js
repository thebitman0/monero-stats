import { parse_config_file, find_config_file } from './config_parse.js';
import process, { execArgv } from 'process';
import https from 'https';
import { SocksProxyAgent } from 'socks-proxy-agent';
import JSON5 from 'json5';

let config_file = null;
if (process.argv[2] && process.argv[2].startsWith('-c')) 
{
    config_file = process.argv[3];
}
else 
{
    config_file = find_config_file();
}

if (config_file == null) 
{
    console.error("Failed to set configuration file");
}

const wallet_addr = parse_config_file(config_file);
if (wallet_addr == null) 
{
    process.exit(-1);
}

const agent = new SocksProxyAgent("socks5://127.0.0.1:9050"); // set this to your Tor proxy
const options = 
{
    hostname: 'www.supportxmr.com',
    port: 443,
    method: "GET",
    path: `/api/miner/${wallet_addr}/stats`,
    agent: agent
};

console.log(agent.proxy);

setInterval(() => {
    const req = https.request(options, (res) => {
        res.setEncoding("utf-8");
        res.on("data", (chunk) => {
            console.log(JSON5.stringify(JSON.parse(chunk), null, 4));
        });
        res.on("error", (error) => {
            console.error("Error: " + error);
        });
        res.on("end", () => {
            console.log("Successful response: " + res.statusCode + '\n');
        });
    });
    req.on("error", (error) => {
        console.error("Error: " + error);
    });
    req.on("finish", () => {
        console.log("Request sendt!");
    });
    req.end();

}, 1000);
