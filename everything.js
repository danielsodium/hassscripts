
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");

const options = {
    ignoreDeclaration: true,
    ignoreAttributes: false ,
    isArray: (name, jpath, isLeafNode, isAttribute) => { 
        if( name == "core") return true;
    }
};

const parser = new XMLParser(options);



const BASE_URL = "http://rpi.apis.acalog.com/v1/"
const DEFAULT_QUERY_PARAMS = "?key=3eef8a28f26fb2bcc514e6f1938929a1f9317628&format=xml"
const CHUNK_SIZE = 500


async function fetchXML(url) {
    return new Promise(async (resolve, reject) => {
        var response = await fetch(url);
        var xml = await response.text();
        resolve(parser.parse(xml));
    })
}

async function getCatalogs() {
    return new Promise(async (resolve, reject) => {
        var url = `${BASE_URL}content${DEFAULT_QUERY_PARAMS}&method=getCatalogs`;
        var results = await fetchXML(url);
        let cataloged = [];
        
        for (var i = 0; i < results.catalogs.catalog.length; i++) {
            year = (results.catalogs.catalog[i]["a:title"]["#text"]).split("Rensselaer Catalog ")[1];
            id = (results.catalogs.catalog[i]["@_id"]).split("acalog-catalog-")[1];
            let tmp = {};
            tmp.id = id;
            tmp.year = year;
            cataloged.push(tmp);
        }
        resolve(cataloged);
    })
}

async function getCourseData(id) {
    var ids = "";
    id.forEach(element => {
        ids += `&ids[]=${element}`;
    });

    var catalogId = 26;
    return new Promise(async (resolve, reject) => {
        var url = `${BASE_URL}content${DEFAULT_QUERY_PARAMS}&method=getItems&options[full]=1&catalog=${catalogId}&type=courses${ids}`; 
        console.log(url)
        var data = await fetchXML(url);


        for (var i = 0; i < data.catalog.courses.length; i++) {
           console.log(JSON.stringify(data.catalog.courses[i].course)) 
        }


        resolve(data);
    })
}
async function getCourseIDS(cid) {
    return new Promise(async (resolve, reject) => {
        var url = `${BASE_URL}search/courses${DEFAULT_QUERY_PARAMS}&method=listing&options[limit]=0&catalog=${cid}` 
        var results = await fetchXML(url);
        resolve(results);
    })
}

async function main() {
    /*
    var catalog = await getCatalogs();
    catalog = catalog.slice(0, 1)

    var coursesPerYear = {};

    for (var i = 0; i < catalog.length; i++) {
        courseIds = await getCourseIDS(catalog[i].id);
        console.log(courseIds)
    }
    */
    var data = await getCourseData([61504, 67696]);


}

main();