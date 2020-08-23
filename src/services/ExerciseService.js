import Service from "./Service";
import ExerciseType from "../data/ExerciseType";

export default class ExerciseService extends Service {

    async loadPublicExercises(page = 0, pageSize = 20, sortBy = "timestamp", sortOrder = "asc", filter = "none", filterBy = "none", language = "fi") {
        
        const response = await this.get(`api/v1/exercises?page=${page}&page=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}&filter=${filter}&filterBy=${filterBy}&lang=${language}`);
        
        return {
            error: response.error,
            exercises: response.exercises?.map(exercise => new ExerciseType(exercise))
        }
    }
}