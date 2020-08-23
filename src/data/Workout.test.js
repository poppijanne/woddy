import Workout from "./Workout";
import Cirquit from "./Cirquit";
import Exercise from "./Exercise";

const countDown = 10;
const durationOfExercises = 20;
const restAfterExercises = 10;
const restAfterCirquit = 10;
const repeats = 2;
const exercises1 = [
    new Exercise({ name: "1", duration: durationOfExercises, rest: restAfterExercises }),
    new Exercise({ name: "2", duration: durationOfExercises, rest: restAfterExercises }),
    new Exercise({ name: "3", duration: durationOfExercises, rest: restAfterExercises })
];

const exercises2 = [
    new Exercise({ name: "4", duration: durationOfExercises, rest: restAfterExercises }),
    new Exercise({ name: "5", duration: durationOfExercises, rest: restAfterExercises }),
    new Exercise({ name: "6", duration: durationOfExercises, rest: restAfterExercises })
];

const exercises3 = [
    new Exercise({ name: "1", duration: durationOfExercises, rest: restAfterExercises })
];

const cirquit1 = new Cirquit({
    id: "1",
    repeats,
    rest: restAfterCirquit,
    exercises: exercises1
})
const cirquit2 = new Cirquit({
    id: "2",
    repeats,
    rest: 0,
    exercises: exercises2
})

const cirquit3 = new Cirquit({
    id: "3",
    repeats: 8,
    rest: 0,
    exercises: exercises3
})

const workout1 = new Workout({
    name: "Test 1",
    countDown,
    cirquits: [
        cirquit1
    ]
})

const workout2 = new Workout({
    name: "Test 2",
    countDown,
    cirquits: [
        cirquit1,
        cirquit2
    ]
})

const workout3 = new Workout({
    name: "Test 3",
    countDown,
    cirquits: [
        cirquit3
    ]
})

const workout4 = new Workout({
    name: "Test 4",
    countDown,
    cirquits: [
        cirquit1,
        cirquit2
    ]
})

test('cirquit-1 duration', () => {
    expect(cirquit1.duration).toBe((durationOfExercises + restAfterExercises) * exercises1.length * repeats + restAfterCirquit - restAfterExercises);
});

test('cirquit-3 duration', () => {
    expect(cirquit3.duration).toBe((durationOfExercises + restAfterExercises) * 8 - restAfterExercises);
});

test('workout-1 duration', () => {
    expect(workout1.duration).toBe(countDown + (durationOfExercises + restAfterExercises) * exercises1.length * repeats - restAfterExercises);
});

test('workout-2 duration', () => {
    expect(workout2.duration).toBe(countDown + ((durationOfExercises + restAfterExercises) * exercises1.length * repeats - restAfterExercises) * 2 + restAfterCirquit);
});

test('workout-3 duration', () => {
    expect(workout3.duration).toBe(countDown + ((durationOfExercises + restAfterExercises) * exercises3.length * 8 - restAfterExercises));
});

test('workout-1 warming up', () => {
    const status = workout1.getStatus(0);
    expect(status.countDownDone).toBe(false);
    expect(status.remainingCountDownTime).toBe(countDown);
    expect(status.done).toBe(false);
    expect(status.previousExercise).toBeUndefined();
    expect(status.currentExercise).toBeUndefined();
    expect(status.currentRound).toBe(1);
    expect(status.nextExercise.id).toBe(exercises1[0].id);
    expect(status.done).toBe(false);
});

const WORKOUT_1_EXERCISE_1_TIME = countDown + 1;

test(`workout-1 first exercise (${WORKOUT_1_EXERCISE_1_TIME} seconds)`, () => {
    const status = workout1.getStatus(WORKOUT_1_EXERCISE_1_TIME);
    expect(status.previousExercise).toBeUndefined();
    expect(status.currentExercise.id).toBe(exercises1[0].id);
    expect(status.nextExercise.id).toBe(exercises1[1].id);
    expect(status.done).toBe(false);
    expect(status.currentRound).toBe(1);
});

const WORKOUT_1_EXERCISE_2_TIME = countDown + durationOfExercises + restAfterExercises + 1;

test(`workout-1 second exercise (${WORKOUT_1_EXERCISE_2_TIME} seconds)`, () => {
    const status = workout1.getStatus(WORKOUT_1_EXERCISE_2_TIME);
    expect(status.currentExercise.id).toBe(exercises1[1].id);
    expect(status.previousExercise.id).toBe(exercises1[0].id);
    expect(status.nextExercise.id).toBe(exercises1[2].id);
    expect(status.done).toBe(false);
    expect(status.currentRound).toBe(1);
});

const WORKOUT_1_REPEAT_2_TIME = countDown + (durationOfExercises + restAfterExercises) * exercises1.length + 1;

test(`workout-1 second repeat (${WORKOUT_1_REPEAT_2_TIME} seconds)`, () => {
    const status = workout1.getStatus(WORKOUT_1_REPEAT_2_TIME);
    expect(status.currentRound).toBe(2);
    expect(status.currentExercise.id).toBe(exercises1[0].id);
    expect(status.previousExercise.id).toBe(exercises1[2].id);
    expect(status.nextExercise.id).toBe(exercises1[1].id);
    expect(status.done).toBe(false);
});

const WORKOUT_1_DONE_TIME = countDown + ((durationOfExercises + restAfterExercises) * exercises1.length) * repeats - restAfterExercises + 1;

test(`workout-1 done (${WORKOUT_1_DONE_TIME} seconds)`, () => {
    const status = workout1.getStatus(WORKOUT_1_DONE_TIME);
    expect(status.duration).toBe(WORKOUT_1_DONE_TIME - 1);
    expect(status.done).toBe(true);
    expect(status.previousExercise.id).toBe(exercises1[2].id);
    expect(status.currentExercise).toBeUndefined();
    expect(status.nextExercise).toBeUndefined();
});

const WORKOUT_2_CIRQUIT_1_REST_TIME = countDown + ((durationOfExercises + restAfterExercises) * exercises1.length * cirquit1.repeats) - restAfterExercises + 3;

test(`workout-2 cirquit 1 rest start (${WORKOUT_2_CIRQUIT_1_REST_TIME} seconds)`, () => {
    const status = workout2.getStatus(WORKOUT_2_CIRQUIT_1_REST_TIME);
    //console.log(status);
    expect(status.resting).toBe(true);
    expect(status.currentCirquit.id).toBe(cirquit2.id);
    expect(status.currentCirquitIndex).toBe(1);
    expect(status.currentExercise).toBe(undefined);
    expect(status.nextExercise.id).toBe(cirquit2.exercises[0].id);
    expect(status.previousExercise.id).toBe(cirquit1.exercises[2].id);
    expect(status.done).toBe(false);
    expect(status.currentRound).toBe(1);
});

const WORKOUT_2_CIRQUIT_2_START_TIME = countDown + ((durationOfExercises + restAfterExercises) * exercises1.length * cirquit1.repeats) - restAfterExercises + restAfterCirquit + 1;

test(`workout-2 cirquit 2 start (${WORKOUT_2_CIRQUIT_2_START_TIME} seconds)`, () => {
    const status = workout2.getStatus(WORKOUT_2_CIRQUIT_2_START_TIME);
    expect(status.currentCirquit.id).toBe(cirquit2.id);
    expect(status.currentCirquitIndex).toBe(1);
    expect(status.currentExercise.id).toBe(cirquit2.exercises[0].id);
    expect(status.nextExercise.id).toBe(cirquit2.exercises[1].id);
    expect(status.previousExercise.id).toBe(cirquit1.exercises[2].id);
    expect(status.done).toBe(false);
    expect(status.currentRound).toBe(1);
});

const WORKOUT_2_DONE_TIME = countDown + (((durationOfExercises + restAfterExercises) * exercises1.length) * repeats - restAfterExercises) * 2 + restAfterCirquit;

test(`workout-2 done (${WORKOUT_2_DONE_TIME} seconds)`, () => {
    const status = workout2.getStatus(WORKOUT_2_DONE_TIME);
    expect(status.done).toBe(true);
});

const WORKOUT_3_DONE_TIME = countDown + (((durationOfExercises + restAfterExercises) * exercises3.length) * cirquit3.repeats) - restAfterExercises;

test(`workout-3 done (${WORKOUT_3_DONE_TIME} seconds)`, () => {
    const status = workout3.getStatus(WORKOUT_3_DONE_TIME);
    expect(status.done).toBe(true);
});

const WORKOUT_4_DONE_TIME = countDown + (durationOfExercises + restAfterExercises) * exercises1.length * cirquit1.repeats + restAfterCirquit + (durationOfExercises + restAfterExercises) * exercises2.length * cirquit2.repeats;

test(`workout-4 done (${WORKOUT_4_DONE_TIME} seconds)`, () => {
    const status = workout4.getStatus(WORKOUT_4_DONE_TIME);
    expect(status.done).toBe(true);
});

test('workout-2 calculate cirquit 2 start time', () => {
    expect(workout2.getCirquitStartTime(cirquit2.id)).toBe(countDown + ((durationOfExercises + restAfterExercises) * exercises1.length * repeats - restAfterExercises) + restAfterCirquit);
});

test('workout move cirquit up', () => {
    const workout = new Workout(workout2);
    expect(workout.cirquits[0].id).toBe(cirquit1.id);
    expect(workout.cirquits[1].id).toBe(cirquit2.id);

    workout.moveCirquitUp(workout.cirquits[1].id);

    expect(workout.cirquits[0].id).toBe(cirquit2.id);
});

test('workout move cirquit down', () => {
    const workout = new Workout(workout2);
    expect(workout.cirquits[0].id).toBe(cirquit1.id);
    expect(workout.cirquits[1].id).toBe(cirquit2.id);

    workout.moveCirquitDown(workout.cirquits[0].id);
    
    expect(workout.cirquits[1].id).toBe(cirquit1.id);
});

test('workout copy cirquit', () => {
    const workout = new Workout(workout2);
    expect(workout.cirquits[0].id).toBe(cirquit1.id);
    expect(workout.cirquits[1].id).toBe(cirquit2.id);

    workout.copyCirquit(workout.cirquits[0].id);

    expect(workout.cirquits[0].id).toBe(cirquit1.id);
    expect(workout.cirquits[1].id).not.toBe(cirquit1.id);
    expect(workout.cirquits[1].exercises[0].id).not.toBe(cirquit1.exercises[0].id);
    expect(workout.cirquits[2].id).toBe(cirquit2.id);
});

test('workout delete first cirquit of two', () => {
    const workout = new Workout(workout2);
    expect(workout.cirquits[0].id).toBe(cirquit1.id);
    expect(workout.cirquits[1].id).toBe(cirquit2.id);

    workout.deleteCirquit(cirquit1.id);
    expect(workout.cirquits[0].id).toBe(cirquit2.id);
    expect(workout.cirquits[1]).toBeUndefined();
});

test('workout delete second cirquit of two', () => {
    const workout = new Workout(workout2);
    expect(workout.cirquits[0].id).toBe(cirquit1.id);
    expect(workout.cirquits[1].id).toBe(cirquit2.id);

    workout.deleteCirquit(cirquit2.id);
    expect(workout.cirquits[0].id).toBe(cirquit1.id);
    expect(workout.cirquits[1]).toBeUndefined();
});