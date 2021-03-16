module.exports = {
    'facebookAuth' : {
        'clientID'      : '327203661179854',
        'clientSecret'  : '87b86faef2b95017dd1d4605f05dbd11',
        'callbackURL'     : 'https://tagit-api.herokuapp.com/auth/fb/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email'
    },
    'googleAuth' : {
        'clientID'         : '317827366745-tkf2ndf7ujaeur4mu26bvi5u4l2ts6li.apps.googleusercontent.com',
        'clientSecret'     : 'tagit',
        'callbackURL'      : 'https://tagit-api.herokuapp.com/auth/google/callback'
    }
};