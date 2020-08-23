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

    console.log(`-------------`);

    return exerciseTypes.filter(exerciseType => {

        if (exerciseType.tempo === 0) {
            return false;
        }

        for (let i = 0; i < params.length; i++) {

            if (params[i].rule === "one of" && exerciseType[property]?.find(value => value === params[i].value) === undefined) {
                console.log(`${exerciseType.name} filtered because ${params[i].value} is not found in ${property} [${exerciseType[property].join(",")}]`);
                return false;
            }
            else if (params[i].rule === "not" && exerciseType[property]?.find(value => value === params[i].value) !== undefined) {
                console.log(`${exerciseType.name} filtered because ${params[i].value} is found in ${property} [${exerciseType[property].join(",")}]`);
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

        let previousExerciseTypeName;
        let previousExercise;

        const cirquit = new Cirquit({
            repeats: template.repeats,
            rest: template.rest,
            exercises: template.exercises.map((exercise, index, exercises) => {

                let name = "?";

                if (exercise.name !== undefined) {
                    name = exercise.name;
                }
                else if (exercise.sameAsPrevious) {
                    name = previousExerciseTypeName;
                }
                else if (exercise.name === undefined) {

                    let tags = exercise.tags;

                    if (exercise.useTagsFromPrevious) {
                        tags = previousExercise.tags;
                    }

                    const exercisesWithSideSwitch = unusedExerciseTypes.filter(type => type.sideSwitch === exercise.sideSwitch);
                    const exerciseTypesWithEquipment = filter("equipment", exercise.equipment, exercisesWithSideSwitch);
                    const exerciseTypesWithMuscles = filter("muscles", exercise.muscles, exerciseTypesWithEquipment);
                    const exerciseTypesWithTags = filter("tags", tags, exerciseTypesWithMuscles);

                    if (exerciseTypesWithTags.length > 0) {
                        name = getRandomExerciseType(exerciseTypesWithTags).name;
                    }
                    else if (exerciseTypesWithMuscles.length > 0) {
                        name = getRandomExerciseType(exerciseTypesWithMuscles).name;
                    }
                    else if (exerciseTypesWithEquipment.length > 0) {
                        name = getRandomExerciseType(exerciseTypesWithEquipment).name;
                    }
                    else if (exercisesWithSideSwitch.length > 0) {
                        name = getRandomExerciseType(exercisesWithSideSwitch).name;
                    }
                    else {
                        name = getRandomExerciseType(exerciseTypes).name;
                    }
                }

                const selectedExerciseIndex = unusedExerciseTypes.findIndex(exerciseType => exerciseType.name === name);
                if (selectedExerciseIndex !== -1) {
                    unusedExerciseTypes.splice(selectedExerciseIndex, 1);
                }

                previousExerciseTypeName = name;

                if (!exercise.sameAsPrevious) {
                    previousExercise = exercise;
                }

                return {
                    name,
                    repeats: exercise.repeats,
                    duration: exercise.duration,
                    rest: exercise.rest
                }
            })
        });

        return cirquit;
    }
}

