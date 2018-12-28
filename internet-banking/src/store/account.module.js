import { userService } from '../api/user.api';
import { router } from '../router'

const user = JSON.parse(localStorage.getItem('user'));
const state = user
    ? { status: { loggedIn: true }, user }
    : { status: {}, user: null };

const actions = {
    login({ dispatch, commit }, { username, password, recaptchaToken }) {
        commit('loginRequest', { username });
        userService.login(username, password, recaptchaToken)
            .then(
                user => {
                    commit('loginSuccess', user);
                    if (user.roles === 'admin') {
                        router.push('/admin');
                    } else {
                        router.push('/');
                    }
                },
                error => {
                    commit('loginFailure');
                    dispatch('alert/error', error.message || error , { root: true });
                }
            );
    },
    logout({ commit }) {
        userService.logout();
        
        commit('logout');
    },
    register({ dispatch, commit }, user) {
        commit('registerRequest');

        return userService.addUser(user)
            .then(
                data => {
                    if(data.success) {
                        commit('registerSuccess');
                        dispatch('alert/success', 'Registration successful', { root: true });
                    } else {
                        commit('registerFailure');
                        dispatch('alert/error', data.message, { root: true });
                    }
                    return data
                },
                error => {
                    commit('registerFailure');
                    dispatch('alert/error', error, { root: true });
                }
            );
    },

    addAccount({dispatch, commit}, userID) {
        commit('addingRequest');
        return userService.addAccount(userID)
            .then(data => {
                if(data.success) {
                    commit('addingSuccess');
                    dispatch('alert/success', 'Add new account successfully', {root: true});
                } else {
                    commit('addingFailure');
                    dispatch('alert/error', data.message, {root: true});
                };

                return data
            }, error => {
                commit('addingFailure');
                dispatch('alert/error', error, { root: true });
            });
    },

    getUserList({dispatch}) {
        return userService.getAllUser()
            .then(data => {
                if(!data.success) {
                    dispatch('alert/error', data.message, {root: true});
                }
                return data
            }, error => {
                dispatch('alert/error', error, { root: true });
            });
    },

    getUserAccounts({dispatch, commit}, userID) {
        commit('addingRequest');
        
        return userService.getUserAccounts(userID)
            .then(data => {
                if(data && !data.success) {
                    dispatch('alert/error', data.message, {root: true});
                };
                commit('addingSuccess');
                return data;
            }, error => {
                commit('addingFailure');
                dispatch('alert/error', error, { root: true });
            });
    },

    rechargeMoney({dispatch, commit}, infoObj) {
        commit('addingRequest');

        return userService.rechargeMoney(infoObj)
            .then(data => {
                if(data.success) {
                    dispatch('alert/success', `Successful recharge ${data.payload.total} for account ${data.payload.accNumber} `, {root: true});
                } else {
                    dispatch('alert/error', data.message, {root: true});
                };

                commit('addingSuccess');
                return data;
            }, error => {
                commit('addingFailure');
                dispatch('alert/error', error, { root: true });
            });
    },

    closeAccount({dispatch, commit}, accountID) {
        commit('addingRequest');

        return userService.closeAccount(accountID)
            .then(data => {
                if(data.success) {
                    dispatch('alert/success', `Successful closed ${data.account.number}`, {root: true});
                } else {
                    dispatch('alert/error', data.message, {root: true});
                };

                commit('addingSuccess');
                return data;
            }, error => {
                commit('addingFailure');
                dispatch('alert/error', error, { root: true });
            });
    }
};

const mutations = {
    loginRequest(state, user) {
        state.status = { loggingIn: true };
        state.user = user;
    },
    loginSuccess(state, user) {
        state.status = { loggedIn: true };
        state.user = user;
        state.loggingIn = false;
    },
    loginFailure(state) {
        state.status = {};
        state.user = null;
        state.loggingIn = false;
    },
    logout(state) {
        state.status = {};
        state.user = null;
    },
    registerRequest(state) {
        state.status.registering = true;
    },
    registerSuccess(state) {
        state.status.registering = false;
    },
    registerFailure(state) {
        state.status.registering = false;
    },
    addingRequest(state) {
        state.status.adding = true;
    },
    addingSuccess(state) {
        state.status.adding = false;
    },
    addingFailure(state) {
        state.status.adding = false;
    },
};

export const account = {
    namespaced: true,
    state,
    actions,
    mutations
};