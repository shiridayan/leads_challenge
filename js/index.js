import fs from 'fs/promises';
import log from '@ajar/marker';
import { parseArgs } from 'util';
// import { Promise}  from 'bluebird';

console.time( "my benchmark");

// ____________________
// Parallel processing
// _____________________
const users = [];
const users_ids ={};

(async () =>{
    const files_name = await fs.readdir("./LEADS");
    log.obj(files_name);    // print all files 

    const pending = files_name.map(async(file_name) => {
    const content = await fs.readFile(`./LEADS/${file_name}`, 'utf-8');
    const lines = content.split('\r\n');
 
    for(const line of lines){      // review in each line for split and slice
        let[fb_id,full_name, email] = line.split(',');
        if(!users_ids[fb_id]){
            full_name = full_name.slice(1, full_name.at(-2));

            const user =  {fb_id, full_name, email};
            users.push(user);
            users_ids[fb_id]=true; // the value of each key
        }
    }
});
    await Promise.all(pending);
    log.info(users.length);
    await fs.writeFile("./results.json", JSON.stringify(users, null, 2));
    console.timeEnd("benchmark");
})().catch(log.error);

