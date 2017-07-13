(function() {

$('head').append('<style>#ReplayDiag{-webkit-user-select:none;}#ReplayDiag.dialog{width:278px;height:245px;}#ReplayDiag.dialog.dialog-front{background-color:#F5FFFA;}#ReplayDiag .dialog-body{position:relative;}#Setkey{position:absolute;top:0;left:0;width:120px;font-size:12px;font-weight:bold;background-color:#F5FFFA;}#SetHotkey{position:absolute;top:0;left:140px;width:40px;background-color:#87CEED;font-size:12px;font-weight:bold;color:#000;}#Autoplay{position:absolute;left:190px;background-color:#32CD32;font-weight:bold;}#BgImg{position:absolute;top:35px;left:5px;width:265px;height:166px;padding:0;pointer-events:none;}</style>');
$('#ReplayDiag .dialog-body').html('<img id="BgImg" src="https://s-media-cache-ak0.pinimg.com/originals/c5/cb/45/c5cb45eccf4d1cbd58d63ea274ceb825.jpg" /><input id="Setkey" placeholder="keydown here" /><button id="SetHotkey">OK</button><button id="Autoplay">AUTO</button>');
$('#ReplayDiag .dialog-title')
    .html('AlphaKKU Ver 2.0')
    .css({ 
        color: '#FFF',
     	fontSize: 12, 
	    fontWeight: 'bold', 
	    width: 255, 
 	    backgroundColor: '#191970'
    });
$('#DictionaryBtn, #ReplayBtn')
    .off('click')  
    .click(function() { 
	    $('#ReplayDiag').toggle(); 
    });
$('.jjo-turn-time').attr('id', 'ROS_Time');

var mobile = !!$('#mobile').html();
var screen = mobile ? $('div.jjo-display').attr('readonly', true) : $('.jjo-display'),
    _talk = $('[id^=UserMessage]'),
    talk = mobile ? $('#game-input').attr('readonly', true) : _talk.length ? _talk : $('#Talk'),
    turn = $('.game-input'),
    time = document.getElementById('ROS_Time'),
    item = $('.GameBox .items'),
    round = $('.rounds'),
    record = $('.history'),
    pic = $('#BgImg'),
    setkey = $('#Setkey'),
    sethotkey = $('#SetHotkey'),
    autoplay = $('#Autoplay');
var ko, en, db,
    mode, opts,
    key, hotkey = mobile ? 18 : 96,
    f, pf,
    lastupdate = 0, lasthistory = 0,
    setlock = false, automode = false,
    word_history = [];
var observer = new WebKitMutationObserver(function(mutations) {
          mutations.forEach(execute_AI);
    });
var config = { attributes: false, childList: true, subtree: true };
var enter = $.Event('keydown', { keyCode: 13 });
 
var KEYNAME = {
    8: "BackSpace", 
    9: "Tab",
    12: "Form Feed",
    13: "Enter", 
    16: "Shift", 
    17: "LCtrl", 
    18: "LAlt",
    19: "Pause",
    20: "CapsLock",
    27: "ESC",
    32: "SpaceBar",
    33: "PgUp", 
    34: "PgDown",
    35: "End", 
    36: "Home",
    37: "Left", 
    38: "Up", 
    39: "Right", 
    40: "Down",
    45: "Insert", 
    46: "Delete",
    91: "WinKey", 
    96: "Numpad0", 
    97: "Numpad1", 
    98: "Numpad2", 
    99: "Numpad3",
    100: "Numpad4", 
    101: "Numpad5",
    102: "Numpad6",
    103: "Numpad7",
    104: "Numpad8",
    105: "Numpad9",
    106: "NumpadMult",
    107: "NumpadAdd",
    109: "NumpadSub",
    110: "NumpadPoint", 
    111: "NumpadDiv",
    112: "F1", 
    113: "F2", 
    114: "F3", 
    115: "F4", 
    116: "F5", 
    117: "F6", 
    118: "F7", 
    119: "F8", 
    120: "F9", 
    121: "F10", 
    122: "F11", 
    123: "F12",
    144: "NumLock",
    186: "Semicolon(;)",
    187: "Equal Sign(=)",
    188: "Comma(,)",
    189: "Hyphen Minus(-)",
    190: "Full Stop(.)",
    191: "Slash(/)",
    192: "Back Tick(`)",
    219: "Square Bracket([)",
    220: "BackSlash(\\)",
    221: "Square Bracket(])",
    222: "Apostrophe(')",
    225: "RCtrl", 
    229: "RAlt"
};
var IMG = [
    'http://www.planwallpaper.com/static/images/53823.jpg',
    'https://wallpaperbrowse.com/media/images/cool-wallpaper-2.jpg',
    'https://wallpaperbrowse.com/media/images/cool-pictures-24.jpg',
    'https://wallpaperbrowse.com/media/images/cool-wallpaper-15.jpg',
    'http://www.planwallpaper.com/static/images/cool-wallpapers_3.jpg',
    'http://www.planwallpaper.com/static/images/Cool-Backgrounds-12.jpg',
    'http://www.planwallpaper.com/static/images/Cool-Car-Wallpapers-431.jpg',
    'https://wallpaperbrowse.com/media/images/Cool-And-Beautiful-Wallpaper.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/2/20/Cool%2C_Calif_sign.jpg',
    'http://www.planwallpaper.com/static/images/6984999-cool-lights_cJkYD47.jpg',
    'http://www.planwallpaper.com/static/images/why-so-serious-cool-wallpaper.jpg',
    'http://www.planwallpaper.com/static/images/cool-wallpapers-640x480_Wev2QOj.jpg',
    'http://www.planwallpaper.com/static/images/04c05a04079a978b0ffa50a1ae42f5a6.jpg',
    'http://www.planwallpaper.com/static/images/Download-Cool-Wallpaper-Cars-Background.jpg',
    'http://www.planwallpaper.com/static/images/Axent-Wear-Cat-Ear-Headphones-a-Cool-Cat-Ear.jpg',
    'http://www.planwallpaper.com/static/images/7004205-cool-black-backgrounds-27640_lhK8IKI.jpg',
    'http://coolwallpaper.website/wp-content/uploads/2016/11/Nice-Really-Cool-Wallpaper-Free-download-best-Latest-3D-HD-desktop-wallpapers-background-Wide-Most-Popular-Images-in-high-quality-resolutions-big-lounge-sofa.jpg'
];
var GAMEMODE = { 
    '한국어 끝말잇기': 'KSH', 
    '한국어 쿵쿵따': 'KKT', 
    '한국어 앞말잇기': 'KAP', 
    '한국어 타자 대결': 'KTY', 
    '한국어 단어 대결': 'KDA', 
    '한국어 십자말풀이': 'KCW', 
    '한국어 솎솎': 'KSS', 
    '자음퀴즈': 'CSQ', 
    '훈민정음': 'HUN', 
    '영어 끝말잇기': 'ESH', 
    '영어 끄투': 'EKT', 
    '영어 타자 대결': 'ETY', 
    '영어 단어 대결': 'EDA', 
    '영어 솎솎': 'ESS'
};

var PLAY = {
    'KSH': function() {
		var m, _Found, _LFound;
		f = screen.text();
        f = f.includes('(') ? '(' + f.replace('(', '|') : f.includes(':') ? pf : f;		
        _Found = opts.includes('미션') && (m = item.text()) ? db.match('\\[' + f + '(.*' + m + '.*)+[^다]\\]') : '';		
        if (_Found) while (_Found = db.match('\\[' + f + '(.*' + m + '.*){' + (_LFound = _Found[0]).split(m).length + ',}[^다]\\]'));
        else  _LFound = (db.match('\\[(' + f + '.*[^다])\\]') || '')[0];
       
        if (_Found = _LFound) transmit(_Found.slice(1, -1), _Found, true);
    },
    'KKT': function() {
        var d, _Found;
		f = screen.text();
        f = f.replace((d = f.match(/\((\d)\)/))[0], '');    
        f = f.includes('(') ? '(' + f.replace('(', '|') : f.includes(':') ? pf : f;
        _Found = (db.match('\\[' + f + '.{' + (+d[1] - 2 + '') + '}[^다]\\]') || '')[0];
        if (_Found) transmit(_Found.slice(1, -1), _Found, true);
    },
    'KAP': function() {
        var m, _Found, _LFound;
		f = screen.text();
        f = f.includes('(') ? '(' + f.replace('(', '|') : f.includes(':') ? pf : f;
        _Found = opts.includes('미션') && (m = item.text()) ? db.match('\\[(.*' + m + '.*)+' + f + '\\]') : '';	
        if (_Found)  while (_Found = db.match('\\[(.*' + m  + '.*){' + (_LFound = _Found[0]).split(m).length + ',}' + f + '\\]'));
        else _LFound = (db.match('\\[(.+' + f + ')\\]') || '')[0];
  	
        if (_Found = _LFound) transmit(_Found.slice(1, -1), _Found, true);
    },
    'KTY': function() { 
        transmit(opts.includes('속담') ? screen.text() : /\S+/.exec(screen.text()), false, false); 
    },
    'KDA': function() { 
        // console.log('한단-준비중'); 
    },
    'KCW': function() { 
        // console.log('십자-준비중'); 
    },
    'KSS': function() {
        var res = screen.html().match(/%;">[가-힣](?=<\/div>)/g).join('').replace(/[^가-힣]/g,'');
        var d, len = 0, chr = '', chrs = '', rSock = [], rSock2, _Found;
        while (len = res.length) {
            res = res.replace(new RegExp(chr = res[0], 'g'), '');
            rSock.push('\\[(.*' + chr + '.*){' + (len - res.length + 1) + ',}\\]');
	        chrs += chr;
        }		
        rSock2 = new RegExp('\\[[' + chrs + ']{' + (d = opts.includes('2글자 금지') ? 3 : 2) + ',}\\]', 'g');
        _Found = ((db.match(rSock2) || []).join('\n').replace(new RegExp(rSock.join('|'), 'g'), '').match('\\[[' + chrs + ']{' + d + ',}\\]') || '')[0];
        if (_Found) transmit(_Found.slice(1, -1), _Found, false);	
    },
    'CSQ': function() { 
        // console.log('자퀴-준비중'); 
    },
    'HUN': function() {
        var res, _Found;
		f = screen.text().slice(1, -1);
        f = f.includes(':') ? pf : f; 
        res = f.replace(/([\u1100-\u1112])/g, function($1) { 
            var a = ($1.charCodeAt(0) - 4352) * 588 + 44032; 
	        return '[' + String.fromCharCode(a) + '-' + String.fromCharCode(587 + a) + ']';
        });	
        if (_Found = (db.match('\\[' + res + '\\]') || '')[0]) transmit(_Found.slice(1, -1), _Found, true);	
    },
    'ESH': function() {        
        var m, _Found, _LFound;
		f = screen.text();
        f = f.includes('(') ? '(' + f.replace('(', '|') : f.includes(':') ? pf : f;		
        _Found = opts.includes('미션') && (m = item.text()) ? db.match('\\[' + f + '(.*' + m + '.*)+\\]') : '';		
        if (_Found) while (_Found = db.match('\\[' + f + '(.*' + m + '.*){' + (_LFound = _Found[0]).split(m).length + ',}\\]'));
        else  _LFound = (db.match('\\[(' + f + '.+)\\]') || '')[0];
       
        if (_Found = _LFound) transmit(_Found.slice(1, -1), _Found, true);
    },
    'EKT': function() {
        var m, _Found, _LFound;
		f = screen.text();
        f = f.includes('(') ? '(' + f.replace('(', '|') : f.includes(':') ? pf : f;
        _Found = opts.includes('미션') && (m = item.text()) ? db.match('\\[' + f + '(.*' + m + '.*)+\\]') : '';
        if (_Found)  while (_Found = db.match('\\[' + f + '(.*' + m + '.*){' + (_LFound = _Found[0]).split(m).length + ',}\\]'));
        else _LFound = (db.match('\\[(' + f + '.+)\\]') || '')[0];
        	
        if (_Found = _LFound) transmit(_Found.slice(1, -1), _Found, true);
    },
    'ETY': function() { 
        this['KTY'];
    },
    'EDA': function() { 
        // console.log('영단-준비중'); 
    },
    'ESS': function() {
        var res = screen.html().match(/%;">\w(?=<\/div>)/g).join('').replace(/[^a-z]/g,'');
        var len = 0, chr = '', chrs = '', rSock = [], _Found;
        while (len = res.length) {
            res = res.split(chr = res[0]).join('');
            rSock.push('\\[(?:.*?' + chr + '){' + (len - res.length + 1) + '}.*\\]');
	        chrs += chr;
        }
        rSock.unshift('\\[.*[^' + chrs + '\\s].*\\]');
        _Found = (db.replace(new RegExp(rSock.join('|'), 'g'), '')).match('\\[[' + chrs + ']{' + (opts.includes('2글자 금지') ? 3 : 2) + ',}\\]');
        if (_Found) transmit(_Found.slice(1, -1), _Found, false);
    }
};

function control_AI(power) {
    power ? observer.observe(time, config) : observer.disconnect();
}

function execute_AI() {
     if (turn.is(':visible')) {
          control_AI(false);
          PLAY[mode]();
	      control_AI(true); 
     }
}

function transmit(msg, erase, memo) {
    if (turn.is(':visible') || /(?:K|E)SS/.test(mode)) {
        var chat = /SS$/.test(mode) ? _talk : talk;
        chat.val(msg).trigger(enter);
	    if (erase) db = db.replace(erase, '');
	    if (memo) pf = f;
    }
}

function changeImage() { 
    var tempsrc = ~~(Math.random() * IMG.length); 
    pic.attr('src', tempsrc === IMG.indexOf(pic.attr('src')) ? changeImage() : IMG[tempsrc]); 
}

function ajax(url) { 
    return $.ajax('https://raw.githubusercontent.com/Rosantex/my/master/' + url);
}

round.on('DOMSubtreeModified', function() {
    if (new Date().getTime() - lastupdate < 5000) return false; 

    opts = $('h5.room-head-mode').html().split(' / ');
    if (!opts) return false;
    
    mode = GAMEMODE[opts.shift()];
    db = mode.charAt(0) === 'E' ? en : ko;
    lastupdate = +new Date();
    changeImage();
});
autoplay.on({
    click: function() { 
        control_AI(automode = !automode);
        this.style.backgroundColor = automode ? 'RoyalBlue' : '#32CD32';
    },
    mouseover: function() { 
        this.style.color = '#F00'; 
    },
    mouseout: function() { 
        this.style.color = '';
    }
});
record.on('DOMSubtreeModified',  function() {
     var stuff, trash;
     if (+new Date() - lasthistory < 300) return false;
	
     if (!(stuff = this.innerHTML) || word_history.includes(trash = stuff.split('<')[1].split('>')[1])) {
          lasthistory = +new Date();
          return false;
     }
     word_history.push(trash);
     db = db.replace('[' + trash + ']', '');
     lasthistory = +new Date();
});
setkey.on({ 
    keydown: function(e) {
        e.stopPropagation();
        e.preventDefault();
        if (setlock) return false; 

	key = e.which;
        setkey.val(KEYNAME[key] || String.fromCharCode(key));
    },
    dblclick: function() { 
        if (setlock) { 
	    setlock = false; 
	    this.style.backgroundColor = '';
	}
    }
});
sethotkey.on({
    click: function() {
        if (setlock) return false;

        hotkey = key;
        setkey.css({ backgroundColor: 'Pink' });
        setlock = true;
    },
    mouseover: function() { 
        this.style.color = '#F00';
    },
    mouseout: function() { 
        this.style.color = '';
    }
});
$(window).keydown(function(e) {
    if (e.which === hotkey && (turn.is(':visible') || /(?:K|E)SS/.test(mode))) {
        e.preventDefault();
        PLAY[mode]();
    }
});

ajax('Ko.txt').then(function(res) {
    ko = res;
});
ajax('En').then(function(res) {
    en = res;
});

$('#ReplayDiag').fadeIn(300);

})();
