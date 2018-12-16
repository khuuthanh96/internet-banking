import { userService } from '../api/user.api';
import { router } from '../router'

const user = JSON.parse(localStorage.getItem('user'));
const state = user
    ? { status: { loggedIn: true }, user }
    : { status: {}, user: null };

const actions = {
    login({ dispatch, commit }, { username, password }) {
        commit('loginRequest', { username });
        userService.login(username, password)
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
                    dispatch('alert/error', error.message, { root: true });
                }
            );
    },
    logout({ commit }) {
        userService.logout();
        
        commit('logout');
    },
    // register({ dispatch, commit }, user) {
    //     commit('registerRequest', user);

    //     userService.register(user)
    //         .then(
    //             user => {
    //                 commit('registerSuccess', user);
    //                 router.push('/login');
    //                 setTimeout(() => {
    //                     // display success message after route change completes
    //                     dispatch('alert/success', 'Registration successful', { root: true });
    //                 })
    //             },
    //             error => {
    //                 commit('registerFailure', error);
    //                 dispatch('alert/error', error, { root: true });
    //             }
    //         );
    // }
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
    registerRequest(state, user) {
        state.status = { registering: true };
    },
    registerSuccess(state, user) {
        state.status = {};
    },
    registerFailure(state, error) {
        state.status = {};
    }
};

export const account = {
    namespaced: true,
    state,
    actions,
    mutations
};