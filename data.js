const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");

const options = {
    isArray: (name, jpath, isLeafNode, isAttribute) => { 
        if( name == "core") return true;
    }
};

const parser = new XMLParser(options);


async function readPaths() {
    const path = "./file.json";
    const file = Bun.file(path);
    
    const contents = await file.json();
    for (var i = 0; i < contents.catalog.programs.program.length; i++) {
        let raw = contents.catalog.programs.program[i];
        if (raw["type"][0]["xi:include"]["xi:fallback"] != "Integrative Pathway") {
            continue;
        }
  
        console.log(raw["a:title"] + " : " + raw["parent"]["xi:include"]["xi:fallback"])
    }   
}
async function scrapeCatalogs() {
    const response = await fetch("http://rpi.apis.acalog.com/v1/content?key=3eef8a28f26fb2bcc514e6f1938929a1f9317628&format=xml&method=getCatalogs");
    const xml = await response.text();
    let parsed = parser.parse(xml);

    //console.log(parsed);
    await Bun.write("./catalogs.json", JSON.stringify(parsed));

}
readPaths()