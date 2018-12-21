const state = {
    type: null,
    message: null
};

const actions = {
    success({ dispatch, commit }, message) {
        commit('success', message);
        setTimeout(() => {
            dispatch('clear');
        }, 5000);
    },
    error({dispatch, commit }, message) {
        commit('error', message);
        setTimeout(() => {
            dispatch('clear');
        }, 5000);
    },
    clear({ commit }, message) {
        commit('success', message);
    }
};

const mutations = {
    success(state, message) {
        state.type = 'alert-success';
        state.message = message;
    },
    error(state, message) {
        state.type = 'alert-danger';
        state.message = message;
    },
    clear(state) {
        state.type = null;
        state.message = null;
    }
};

export const alert = {
    namespaced: true,
    state,
    actions,
    mutations
};