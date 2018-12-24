import config from '../config';

const conf = config['dev']

export const userService = {
    login,
    logout,
    addUser,
    getAllUser,
    addAccount,
    getUserAccounts,
    rechargeMoney
};

//authenticate api
function login(username, password, recaptchaToken) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, recaptchaToken })
    };
    
    return fetch(`${conf.api}/auth/login`, requestOptions)
        .then(response => {
            return response.text()
            .then(text => {
                const data = text && JSON.parse(text);
                if (!response.ok) {
                    const error = (data && data.message) || response.statusText;
                    return Promise.reject(error);
                }
    
                localStorage.setItem('user', JSON.stringify(data.user));
                return data.user;
            })

        }, error => {
            console.log("error ", error)
            return Promise.reject(error);
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}


function refreshtoken() {
    const user = JSON.parse(localStorage.getItem('user'));
    const refreshTok = user && user.refreshToken;
    
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({refreshToken: refreshTok})
    };

    return fetch(`${conf.api}/auth/refreshtoken`, requestOptions)
        .then(async response => {
            return await response.text()
                .then(text => {
                    const data = text && JSON.parse(text);
                    if (!response.ok) { //nếu không thành công thì logout users
                        if (response.status === 401) {
                            const data = text && JSON.parse(text);
            
                            if (data.rt) {
                                logout();
                                location.reload(true);
                                return false;
                            }
                        }
                    }
                    let user = JSON.parse(localStorage.getItem('user'));
                    user.accessToken = data.accesstoken
                    localStorage.setItem('user', JSON.stringify(user));
                    return true;
                })
        })
}

//admin api
function addUser(userInfo) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo)
    };

    return fetch(`${conf.api}/api/user`, requestOptions)
        .then(res => handleResponse(res, addUser, userInfo))
        .then(data => data)
        .catch(err => err)
}

function getAllUser() {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };

    return fetch(`${conf.api}/api/user`, requestOptions)
        .then(res => handleResponse(res, getAllUser))
        .then(data => data)
        .catch(err => err)
}

function addAccount(userID) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID })
    };

    return fetch(`${conf.api}/api/account`, requestOptions)
    .then(res => handleResponse(res, addAccount, userID))
    .then(data => data)
    .catch(err => err)
}

function getUserAccounts(userID) {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };

    return fetch(`${conf.api}/api/accounts/${userID}`, requestOptions)
    .then(res => handleResponse(res, getUserAccounts))
    .then(data => data)
    .catch(err => err)
}

function rechargeMoney(infoObj) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({total: infoObj.total})
    };

    return fetch(`${conf.api}/api/account/${infoObj.accID}`, requestOptions)
    .then(res => handleResponse(res, rechargeMoney))
    .then(data => data)
    .catch(err => err)
}

//helper function
function handleResponse(response, cb, param1, param2, param3) {
    return response.text()
        .then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            return data;
        })
        .catch(async _ => { //nếu bị lỗi: statuscode 401 unauthorized
            if (!response.ok) {
                if (response.status === 401) {
                    const ok = await refreshtoken() //gọi api refreshtoken để lấy accesstoken mới
                    if (ok) { //nếu thành công thì gọi lại callback url
                        cb(param1, param2, param3) // các param để dự phòng nếu callback url cần truyển nhiều param
                        .then(_ => { //thành công thì reload page để cập nhật lại dữ liệu mới
                            location.reload(true)
                        });
                        //thất bại thì đã được xử lí trong function refreshtoken()
                    }
                }

            }
        });
}

function authHeader() {
    // return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.accessToken) {
        return { 'Authorization': 'Bearer ' + user.accessToken };
    } else {
        return {};
    }
}