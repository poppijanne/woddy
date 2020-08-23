import CirquitTemplate from "../../data/CirquitTemplate";
import { CirquitGenerator, FilterParam } from "./Generators";
import ExerciseType from "../../data/ExerciseType";


const warmup = new CirquitTemplate({
    name: "Lämmittely",
    repeats: 6,
    rest: 60,
    exercises: [
        {
            tags: [new FilterParam("Lämmittely")],
            duration: 60,
            rest: 5
        },
        {
            tags: [new FilterParam("Lämmittely")],
            duration: 60,
            rest: 5
        }
    ]
})

const fortyTwenty = new CirquitTemplate({
    name: "40 / 20 + sykeliike",
    repeats: 2,
    rest: 120,
    exercises: [
        {
            tags: [new FilterParam("Core"), new FilterParam("Sykeliike", "not")],
            duration: 40,
            rest: 20
        },
        {
            muscles: [new FilterParam("Jalat")],
            duration: 40,
            rest: 20
        },
        {
            muscles: [new FilterParam("Kädet")],
            duration: 40,
            rest: 20
        },
        {
            muscles: [new FilterParam("Vatsat")],
            duration: 40,
            rest: 20
        },
        {
            tags: [new FilterParam("Sykeliike")],
            duration: 60,
            rest: 30
        }
    ]
})

const tabata6RoundsKettlebell = new CirquitTemplate({
    name: "Tabata",
    repeats: 6,
    rest: 60,
    exercises: [
        {
            equipment: [new FilterParam("Kahvakuula")],
            duration: 20,
            rest: 10
        }
    ]
})

const planks = new CirquitTemplate({
    name: "Lankkuhaaste",
    repeats: 1,
    rest: 60,
    exercises: [
        {
            name: "Kylkilankku",
            duration: 60,
            rest: 5
        },
        {
            name: "Kylkilankku",
            duration: 60,
            rest: 5
        },
        {
            name: "Lankku",
            duration: 60,
            rest: 0
        }
    ]
})


const exerciseTypes = [
    new ExerciseType({ name: "Haaraperushyppy", muscles: ["Jalat"], tags: ["Lämmittely", "Kehonpaino"] }),
    new ExerciseType({ name: "Hiihto", muscles: ["Jalat"], tags: ["Lämmittely", "Kehonpaino"] }),
    new ExerciseType({ name: "Etuheilautus ja pistoolityöntö lankkuasennosta", equipment: ["Kahvakuula"], muscles: ["Kädet", "Hartiat", "Kyljet"], tags: ["Core", "Syke"] }),
    new ExerciseType({ name: "Etuheilautus kahdella kädellä", equipment: ["Kahvakuula"], muscles: ["Vatsat", "Hartiat", "Jalat", "Pakarat"], tags: ["Core"] }),
    new ExerciseType({ name: "Etuheilautus yhdellä kädellä", equipment: ["Kahvakuula"], muscles: ["Vatsat", "Hartiat", "Jalat", "Pakarat"], tags: ["Core"] }),
    new ExerciseType({ name: "Russian Twist", equipment: ["Kahvakuula", "Matto"], muscles: ["Vatsat", "Kyljet"] }),
    new ExerciseType({ name: "Pull Over", equipment: ["Kahvakuula", "Matto"], muscles: ["Vatsat"] }),
    new ExerciseType({ name: "Knee Grab", equipment: ["Matto"], muscles: ["Vatsat"], tags: ["Kehonpaino"] }),
];

test('template planks', () => {
    const generator = new CirquitGenerator();
    const cirquit = generator.generateCirquitFromTemplate(planks, exerciseTypes);
    expect(cirquit.exercises.length).toBe(3);
    expect(cirquit.exercises[0].name).toBe("Kylkilankku");
    expect(cirquit.exercises[2].name).toBe("Lankku");
});

test('template warmup', () => {
    const generator = new CirquitGenerator();
    const cirquit = generator.generateCirquitFromTemplate(warmup, exerciseTypes);
    expect(cirquit.exercises.length).toBe(2);
    expect(["Haaraperushyppy", "Hiihto"]).toContain(cirquit.exercises[0].name);
    expect(["Haaraperushyppy", "Hiihto"]).toContain(cirquit.exercises[1].name);
    expect(cirquit.exercises[0].name).not.toBe(cirquit.exercises[1].name);
});

test('template 6 round tabata with a kettlebell exercise', () => {
    const generator = new CirquitGenerator();
    const cirquit = generator.generateCirquitFromTemplate(tabata6RoundsKettlebell, exerciseTypes);
    expect(cirquit.repeats).toBe(6);
    expect(cirquit.rest).toBe(60);
    expect(cirquit.exercises.length).toBe(1);
    expect(cirquit.exercises[0].duration).toBe(20);
    expect(cirquit.exercises[0].rest).toBe(10);
    expect(["Etuheilautus ja pistoolityöntö lankkuasennosta", "Etuheilautus kahdella kädellä", "Etuheilautus yhdellä kädellä", "Russian Twist", "Pull Over"]).toContain(cirquit.exercises[0].name);
});