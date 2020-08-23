import Service from "./Service";

export default class UserService extends Service {

    async loadMyInformation() {
        return await this.get(`api/v1/user/me`);
    }

    async login(email, pass) {
        return await this.post(`api/v1/user/login`, { email, pass });
    }

    async registerNewUser(user) {
        return await this.post(`api/v1/user/register`, user);
    }

    async sendMessage(message) {
        return await this.post(`api/v1/contact`, { message });
    }

    async saveUser(user) {
        return await this.put(`api/v1/user`, user);
    }

    async unregister() {
        return await this.delete(`api/v1/users/me`);
    }

    async logout() {
        return await this.post(`api/v1/user/logout`);
    }

    async sendLoginLink(email) {
        return await this.post(`api/v1/user/send-reset-password-link`, { email });
    }

    async changePassword(userId, oldPassword, newPassword) {
        return await this.put(`api/v1/user/${userId}/password`, { oldPassword, newPassword });
    }

    async changePasswordWithToken(userId, resetPasswordToken, newPassword) {
        return await this.put(`api/v1/user/${userId}/password`, { resetPasswordToken, newPassword });
    }
}