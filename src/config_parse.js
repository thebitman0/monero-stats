import * as fs from 'fs';
import path from 'path';
import JSON5 from 'json5';

export function parse_config_file(path) 
{
    let file_contents = null;
    try 
    {
        file_contents = fs.readFileSync(path, "utf-8");
    }
    catch (error) 
    {
        console.error("Error: " + error);
        return null;
    }
    
    const data = JSON5.parse(file_contents);
    if (!data) 
    {
        console.error("Failed to parse data");
        return null;
    }
    
    const wallet_addr = data["xmr_wallet_address"];
    if (!wallet_addr) 
    {
        console.error("No Monero wallet address provided");
        return null;
    }
    
    return wallet_addr;
}

export function find_config_file() 
{
    const __dirname = path.resolve();
    const directory = fs.opendirSync(__dirname, { encoding: "utf-8" });
    
    let entry = null;
    while ((entry = directory.readSync()) !== null) 
    {
        if (entry.isFile() && entry.name.endsWith(".json5") && entry.name.includes("config")) 
        {
            directory.closeSync();
            return entry.parentPath + '/' + entry.name;
        }
    }

    return null;
}
