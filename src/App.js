import React, { useEffect } from 'react';
import { Route, HashRouter as Router } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
import TimerActions from './components/timer/TimerActions';
import TimerView from './components/timer/TimerView';
import WorkoutView from './components/workout/WorkoutView';
import Navigator from './components/Navigator';
import ExerciseSideBar from './components/common/ExerciseSideBar';
import NumberSelectDialog from './components/common/NumberSelectDialog';
import ExerciseTypeSelectDialog from './components/common/ExerciseTypeSelectDialog';
import ExerciseService from './services/ExerciseService';
import FrontPageView from './components/front-page/FrontPageView';
import MyWorkoutsView from './components/workout/MyWorkoutsView';
import User from './data/User';
import UserView from './components/user/UserView';
import UserService from './services/UserService';
import AddCirquitDialog from './components/workout/AddCirquitDialog';
import ChangePasswordView from './components/user/ChangePasswordView';

function App() {

    console.log("App()")

    const { user, exerciseTypes } = useSelector(state => state)
    const dispatch = useDispatch()

    const loadExercises = async () => {
        const exerciseService = new ExerciseService();
        const response = await exerciseService.loadPublicExercises();
        if (response.error) {
            alert(response.error.message);
        }
        else {
            dispatch({
                type: "ADD EXERCISE TYPES", payload: response.exercises
            })
        }
    };

    const loadUser = async () => {
        const service = new UserService();
        const response = await service.loadMyInformation();
        if (response.error) {
            alert(response.error.message);
        }
        else if (response.isLoggedIn === true) {
            dispatch({
                type: "SET USER", payload: new User(response.user)
            })
        }
    }

    useEffect(() => {

        window.onresize();
        /*
                const workout = new Workout({
                    name: "Treeni",
                    author: "Janne Kivilahti",
                    info: "Testitreeni, eri pituisia sarjoja eri lihasryhmille",
                    tags: ["crossfit","testi"],
                    countDown: 10,
                    cirquits: [
                        new Cirquit({
                            repeats: 1, rest: 0, exercises: [
                                new Exercise({ name: "Kahden käden etuheilautus", duration: 10, rest: 5 }),
                            ]
                        }),
                        new Cirquit({
                            repeats: 2, rest: 60, exercises: [
                                new Exercise({ name: "Kahden käden etuheilautus", duration: 40, rest: 20 }),
                                new Exercise({ name: "Hauiskääntö", duration: 40, rest: 20 }),
                                new Exercise({ name: "Kyykky", duration: 40, rest: 20 }),
                                new Exercise({ name: "Russian Twist", duration: 40, rest: 20 }),
                                new Exercise({ name: "Sit Through", duration: 60, rest: 30 })
                            ]
                        }),
                        new Cirquit({
                            repeats: 2, rest: 60, exercises: [
                                new Exercise({ name: "Etuheilautus käden vaihdolla", duration: 40, rest: 20 }),
                                new Exercise({ name: "Etuheilautus kahdella kädellä", duration: 40, rest: 20 }),
                                new Exercise({ name: "Heilautus ja pistoolityöntö lankkuasennosta", duration: 40, rest: 20 }),
                                new Exercise({ name: "Halo + hauiskääntö", duration: 40, rest: 20 }),
                                new Exercise({ name: "Vuorikiipeily", duration: 60, rest: 30 }),
                                new Exercise({ name: "Vuorikiipeily", duration: 60, rest: 30 }),
                                new Exercise({ name: "Vuorikiipeily", duration: 60, rest: 30 }),
                                new Exercise({ name: "Heilautus ja pistoolityöntö lankkuasennosta", duration: 40, rest: 20 }),
                                new Exercise({ name: "Heilautus ja pistoolityöntö lankkuasennosta", duration: 40, rest: 20 }),
                            ]
                        }),
                        new Cirquit({
                            repeats: 2, rest: 60, exercises: [
                                new Exercise({ name: "Työntö yhdellä kädellä selinmakuulta", duration: 20, rest: 10 }),
                                new Exercise({ name: "Kahden käden tempaus", duration: 20, rest: 10 }),
                                new Exercise({ name: "Kyykky", duration: 20, rest: 10 })
                            ]
                        }),
                        new Cirquit({
                            repeats: 6, rest: 60, exercises: [
                                new Exercise({ name: "Burbees", duration: 20, rest: 10 }),
                            ]
                        }),
                        new Cirquit({
                            repeats: 1, rest: 60, exercises: [
                                new Exercise({ name: "Askelkyykky ja nytkytys", duration: 20, rest: 10 }),
                                new Exercise({ name: "Askelkyykky ja nytkytys", duration: 20, rest: 10 }),
                                new Exercise({ name: "Askelkyykky ja nytkytys", duration: 20, rest: 10 }),
                                new Exercise({ name: "Askelkyykky ja nytkytys", duration: 20, rest: 10 }),
                                new Exercise({ name: "Askelkyykky ja nytkytys", duration: 20, rest: 10 }),
                                new Exercise({ name: "Askelkyykky ja nytkytys", duration: 20, rest: 10 }),
                                new Exercise({ name: "Askelkyykky ja nytkytys", duration: 20, rest: 10 }),
                                new Exercise({ name: "Askelkyykky ja nytkytys", duration: 20, rest: 10 })
                            ]
                        })
                    ]
                })
                dispatch({ type: "ADD WORKOUTS", payload: [workout] });
                dispatch({ type: "SET WORKOUT", payload: workout });
        */
        if (user === null) {
            loadUser();
        }

        if (exerciseTypes.length === 0) {
            loadExercises();
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    return (
        <div onClick={e => dispatch({ type: "GLOBAL CLICK" })}>
            <NumberSelectDialog />
            <ExerciseTypeSelectDialog />
            <AddCirquitDialog />
            <Router>
                <Navigator />
                <main role="main" id="main">
                    <Route path="/" exact component={FrontPageView} />
                    <Route path="/user/:userId/workouts" exact component={MyWorkoutsView} />
                    <Route path="/user/:userId/password" exact component={ChangePasswordView} />
                    <Route path="/user/me" exact component={UserView} />
                    <Route path="/workout" exact component={WorkoutView} />
                    <Route path="/workout/:workoutId" exact component={WorkoutView} />
                    <Route exact path="/timer" component={TimerView} />
                    <Route exact path="/timer/workout/:workoutId" component={TimerView} />
                    <Route exact path="/timer/workout/:workoutId/cirquit/:cirquitId" component={TimerView} />
                </main>

                <TimerActions />
            </Router>
            <ExerciseSideBar />

        </div>
    );
}

export default App;
