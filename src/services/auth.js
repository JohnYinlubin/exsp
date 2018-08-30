import ls from '../utils/localStorage';
import api from '../api';

export default {

  async login() {
    const api = 'https://accounts.spotify.com/authorize';
    const clientID = 'fe86f5b47d0b4cea8fd6eb37741aad92';
    const {host, protocol, pathname} = window.location;
    const redirectUri = `${protocol}//${host}${pathname}`;
    const scope = 'playlist-read-private%20playlist-read-collaborative%20playlist-modify-public%20playlist-modify-private';
    const responseType = 'token';

    window.location = `${api}?client_id=${clientID}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;
  },

  logout() {
    let script = document.createElement('script');

    script.src = 'https://www.spotify.com/logout/';
    document.getElementById('app').appendChild(script);

    ls.clear();

    setTimeout(function () {
      window.location.reload();
    }, 1000)
  },

  setAccessToken(token) {
    ls.set('token', token);
  },

  setExpiryTime(time) {
    ls.set('expiry', time);
  },

  getAccessToken() {
    return ls.get('token');
  },

  getExpiryTime() {
    return ls.get('expiry');
  },

  getUserId(){
    return ls.get('user_id');
  },

  async initUser() {
    try{
      const response = await api.getUserProfile();
      ls.set('user_id', response.data.id);
    } catch (e) {
      console.error(e);
    }
  },

  getTokensFromQuery() {
    const vars = window.location.hash.substring(1).split('&');
    let key = {};

    for (let i = 0; i < vars.length; i++) {
      let tmp = vars[i].split('=');
      key[tmp[0]] = tmp[1];
    }

    if (key.access_token && key.expires_in) {
      this.setAccessToken(key.access_token);
      this.setExpiryTime(key.expires_in);

      this.initUser();
    }
  }
};
