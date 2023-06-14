'use strict';

import { Request, Response } from 'express';
import path from 'path'
import busboy from 'busboy'
import fs from 'fs'
import { parse } from 'csv-parse'

interface csvReader { organizacion:string, usuario:string, rol:string }
interface schemaResult { organization:string, users: { username: string, roles: string[] }[] } 

function convertCsvToJson(req: Request, res: Response): void { 
    let filename = '';
    let response: schemaResult[] = [];

    const formData = busboy({ headers: req.headers });
    formData.on('file', (name, file, info) => {

    // Send this msj, because file name is not indicated in the example
    filename = info.filename;
    if (filename != "data.csv") {
        res.writeHead(200, { 'content-Type': 'text/html' });
        res.write(`<h1>Debes cargar un archivo con nombre data.csv cambiale el nombre a: ${filename}</h1>`);
        res.write(`<br> <button><a href="/">Convert Again</a></button>`)
        res.end()
        return
    }
    const saveTo = path.join(__dirname, filename);
    file.pipe(fs.createWriteStream(saveTo));

    //Read information from file csv saved on the server
    const dataFromCsv:csvReader[] = [];
    fs.createReadStream(saveTo).pipe(parse({delimiter: ",",columns: true,}))
    .on("data", row => dataFromCsv.push(row))
    .on("error", error => console.log(error.message))
    .on("end", () => {    
        // Find unique organizations from CSV not repeating
        let organizationsFromCsv = dataFromCsv.map((userCsv) => userCsv.organizacion);
        organizationsFromCsv = organizationsFromCsv.filter(onlyValue);

        organizationsFromCsv.forEach(organization => {
        // Prepare Schema for response
        const schemaResult:schemaResult = {
            organization: "",
            users: []
        }
        const organizationSchema = { ...schemaResult};
        const usersByOrganization = dataFromCsv.filter(user => user.organizacion === organization)
        
        // Find unique usernames from CSV not repeating username by organization
        let usernames = usersByOrganization.map((userByOrganization) => userByOrganization.usuario);
        usernames = usernames.filter(onlyValue);

        usernames.forEach(username => {       
            const userWithRols = usersByOrganization.filter(userByOrganization => userByOrganization.usuario === username);

            // Map data to organization Schema
            let rolsByUser: string[] = []
            if (userWithRols.length > 0) {
            userWithRols.forEach(user => rolsByUser.push(user.rol));
            }
            organizationSchema.users.push( {username: username, roles: rolsByUser} )  
            organizationSchema.organization = organization

        })
        response.push(organizationSchema)
        })
        res.writeHead(200, { 'content-Type': 'text/html' });
        res.write(`<h1>upload success data on json</h1>:<i>FROM</i>:${filename}<br><div style="width:50%; margin:0 auto;"> ${JSON.stringify(response)}</div>`);
        res.write(`<br> <button><a href="/">Convert Again</a></button>`)
        res.end();  
        console.log("response" + JSON.stringify(response))
    });
    });
    req.pipe(formData);
}

function onlyValue(value, index, array) {
  return array.indexOf(value) === index;
}

export { convertCsvToJson }
