async function readPaths() {
    const path = "./quacs.json";
    const file = Bun.file(path);
    const preReqFile = Bun.file("./prereqs.json");
    
    const contents = await file.json();
    const prereqs = await preReqFile.json();

    var returning = {};

    // Loops through departments
    for (var i = 0; i < contents.length; i++) {
        // Loops through classes
        for (var j = 0; j < contents[i].courses.length; j++) {
           
            let raw = contents[i].courses[j];
            let course = {};

            course["ID"] = raw.crse;
            course.name = raw.title;
            course.subj = raw.subj;

            course.sections = {};
            course.professors = [];

            for (var k = 0; k < raw.sections.length; k++) {
                course.sections[k] = {};
                course.sections[k]["location"] = raw.sections[k].timeslots[0].location;
                course.sections[k]["instructor"] = raw.sections[k].timeslots[0].instructor;
                if (!course.professors.includes(course.sections[k]["instructor"])) {
                    course.professors.push(course.sections[k]["instructor"]);
                }


                // Prereqs
                course.sections[k]["prerequisites"] = [];
                if (prereqs[raw.sections[k].crn] != undefined) {
                }


            }

            returning[course.name] = course;

        }
    } 


    await Bun.write("./format.json", JSON.stringify(returning));
}

readPaths()