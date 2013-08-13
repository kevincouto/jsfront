//var bcrypt = require('bcrypt'); 

var session = {
    create: function(){
        var uid = Math.random();
        
        while(_sessions[uid])
            uid = Math.random();
        
        _sessions[uid] = {
            session : session,
            date    : Date.now(),
            id      : req.sessionID
        };
        
        return _sessions[uid];
    },
    
    login: function (req, res, user) {
        if (bcrypt.compare_sync(req.param('passwordLogin'), user.password)) {
          if (req.session) {
            log.info('Someone logged in! ' + req.param('username') + ' ' + user._id);
            req.session.user = user;
            if (req.param('remember') == 'on') {
              res.cookie('rememberme', 'yes', { maxAge: 31557600000});
            }
            else {
              res.cookie('rememberme', 'yes');
            }
          }
        }
        else {
          log.trace('Wrong password for ' + user.username + '!');
        }
      },
      
      logout: function (req, res) {
        if (req.session.user) {
          log.info('Logging Out: ' + req.session.user.username);
          delete req.session.user;
          res.clearCookie('rememberme', {path:'/'});
        }
      }
}

var _sessions = {},
    _defaults = {
        ttl: 30*1000//30 segundos após a criação da sessão, a sessão expira
    };

function verify(token) {
    var tmp = _session[token], s=null;
    
    if(tmp && tmp.date > Date.now() - _defaults.ttl) {
        var s = tmp;
        delete _session[token]
    }
    
    return s;
}

module.exports = session;