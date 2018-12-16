import config from '../config';

const conf = config['dev']

export const userService = {
    login,
    logout
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`${conf.api}/auth/login`, requestOptions)
        .then(handleResponse)
        .then(data => {
            // login successful if there's a jwt token in the response
            if (data.user.accessToken) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
            
                localStorage.setItem('user', JSON.stringify(data.user));
            }

            return data.user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}


function refreshtoken() {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(true), 'Content-Type': 'application/json' }
    };

    return fetch(`${conf.api}/auth/refreshtoken`, requestOptions)
        .then(handleResponse)
        .then(data => {
            let user = JSON.parse(localStorage.getItem('user'));
            user.accessToken = data.accesstoken
            localStorage.setItem('user', JSON.stringify(user));
        })
}


//helper function
function handleResponse(response, cb, param1, param2, param3) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                if (data.rt) { //if rt = true in response -> this is refresh token request
                    logout();
                    location.reload(true);
                } else if (cb) { // accesstoken expire -> call refreshtoken api
                    return refreshtoken()
                    .then(_ => cb(param1, param2, param3))            
                }
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}

function authHeader(refreshtoken) {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user'));

    //get refreshtoken if this param is `true`
    if (refreshtoken) {
        if (user && user.refreshToken) {
            return { 'Authorization': 'Bearer ' + user.accessToken }
        }
        else {
            return {};
        }
    }
    
    if (user && user.accessToken) {
        return { 'Authorization': 'Bearer ' + user.accessToken };
    } else {
        return {};
    }
}