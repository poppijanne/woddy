import Cirquit from "../../data/Cirquit";

export class FilterParam {
    constructor(value, rule = "one of") {
        this.value = value;
        this.rule = rule;
    }
}

function filter(property, params, exerciseTypes) {

    if (params === undefined || params.length === 0) {
        return [...exerciseTypes];
    }

    return exerciseTypes.filter(exerciseType => {

        if (exerciseType.tempo === 0) {
            return false;
        }

        for (let i = 0; i < params.length; i++) {

            if (params[i].rule === "one of" && exerciseType[property]?.find(value => value === params[i].value) === undefined) {
                //console.log(`${exerciseType.name} filtered because ${params[i].value} is not found in ${property} [${exerciseType[property].join(",")}]`);
                return false;
            }
            else if (params[i].rule === "not" && exerciseType[property]?.find(value => value === params[i].value) !== undefined) {
                //console.log(`${exerciseType.name} filtered because ${params[i].value} is found in ${property} [${exerciseType[property].join(",")}]`);
                return false;
            }
        }
        return true;
    })
}

function getRandomExerciseType(exerciseTypes) {
    return exerciseTypes[Math.min(exerciseTypes.length, Math.floor(Math.random() * exerciseTypes.length))];
}

export class CirquitGenerator {

    generateCirquitFromTemplate(template, exerciseTypes) {

        let unusedExerciseTypes = [...exerciseTypes];

        //let previousExerciseTypeName;
        let exerciseType;
        let previousExerciseType;
        let previousExerciseDescription;

        const cirquit = new Cirquit({
            repeats: template.repeats,
            rest: template.rest,
            exercises: template.exercises.map((exerciseDescription, index, exerciseDescriptions) => {

                if (exerciseDescription.name !== undefined) {
                    //name = exerciseDescription.name;
                    exerciseType = exerciseTypes.find(exerciseType => exerciseType.name === exerciseDescription.name);
                }
                else if (exerciseDescription.sameAsPrevious) {
                    exerciseType = previousExerciseType;
                }
                else if (exerciseDescription.name === undefined) {

                    let tags = exerciseDescription.tags;

                    if (exerciseDescription.useTagsFromPrevious) {
                        console.log("use previous tags");

                        const previousExerciseTypeTags = previousExerciseType.tags.map(tag => new FilterParam(tag))

                        tags = [...previousExerciseDescription.tags, ...previousExerciseTypeTags];
                        console.log(tags);
                    }

                    const exercisesWithSideSwitch = unusedExerciseTypes.filter(type => type.sideSwitch === exerciseDescription.sideSwitch);
                    const exerciseTypesWithEquipment = filter("equipment", exerciseDescription.equipment, exercisesWithSideSwitch);
                    const exerciseTypesWithMuscles = filter("muscles", exerciseDescription.muscles, exerciseTypesWithEquipment);
                    const exerciseTypesWithTags = filter("tags", tags, exerciseTypesWithMuscles);

                    if (exerciseTypesWithTags.length > 0) {
                        exerciseType = getRandomExerciseType(exerciseTypesWithTags);
                    }
                    else if (exerciseTypesWithMuscles.length > 0) {
                        exerciseType = getRandomExerciseType(exerciseTypesWithMuscles);
                    }
                    else if (exerciseTypesWithEquipment.length > 0) {
                        exerciseType = getRandomExerciseType(exerciseTypesWithEquipment);
                    }
                    else if (exercisesWithSideSwitch.length > 0) {
                        exerciseType = getRandomExerciseType(exercisesWithSideSwitch);
                    }
                    else {
                        exerciseType = getRandomExerciseType(exerciseTypes);
                    }
                }

                const selectedExerciseIndex = unusedExerciseTypes.findIndex(type => type.name === exerciseType.name);
                if (selectedExerciseIndex !== -1) {
                    unusedExerciseTypes.splice(selectedExerciseIndex, 1);
                }

                previousExerciseType = exerciseType;

                if (!exerciseDescription.sameAsPrevious) {
                    previousExerciseDescription = exerciseDescription;
                }

                return {
                    name: exerciseType?.name || "?",
                    repeats: exerciseDescription.repeats,
                    duration: exerciseDescription.duration,
                    rest: exerciseDescription.rest
                }
            })
        });

        return cirquit;
    }
}

