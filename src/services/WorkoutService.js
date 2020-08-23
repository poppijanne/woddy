import Service from "./Service";

export default class WorkoutService extends Service {

    async loadWorkoutSummaries({ userId, page = 0, pageSize = 20, sortBy = "createdTs", sortOrder = "ASC", filter = "none", filterBy = "none" } = {}) {
        return await this.get(`/api/v1/user/${userId}/workouts?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}&filter=${filter}&filterBy=${filterBy}`);
    }

    async loadWorkout(workoutId) {
        return await this.get(`/api/v1/workout/${workoutId}`);
    }

    async saveWorkout(workout, summary, userId) {
        if (workout.createdTs && workout.userId === userId) {
            return await this.put(`/api/v1/workout`, { workout, summary });
        }
        else {
            return await this.post(`/api/v1/workout`, { workout, summary });
        }
    }

    async deleteWorkout(workoutId) {
        return await this.delete(`/api/v1/workout/${workoutId}`);
    }
}