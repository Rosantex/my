<script type ="text/javascript">

var isMobile = Number(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

$(document).off('paste');

$('#ReplayDiag.dialog').css({
    height: 245,
    width: 278
});

$('#ReplayDiag.dialog.dialog-front').css({ background: 'MintCream' });

$('#ReplayDiag .dialog-body')
    .html("<input type='image' id='BgImg' src='https://s-media-cache-ak0.pinimg.com/originals/c5/cb/45/c5cb45eccf4d1cbd58d63ea274ceb825.jpg' /><input type='text' id='Setkey' value='keydown here' /><input type='button' id='SetHotkey' value='OK' /><input type='button' id='Autoplay' value='Auto' />")
    .css({ position: 'relative' });

$("#ReplayDiag .dialog-title")
    .html('AlphaKKU Ver 1.999')
    .css({ 
        color: 'white', 
     	fontSize: 12, 
	fontWeight: 'bold', 
	width: 255, 
 	background: 'MidnightBlue', 
	WebkitUserSelect: 'none' 
    });

$('#Setkey').css({ 
    fontSize: 12, 
    fontWeight: 'bold', 
    width: 120, 
    top: 0, 
    left: 0, 
    position: 'absolute', 
    background: 'MintCream' 
});

$('#SetHotkey').css({ 
    color: 'black', 
    fontSize: 12, 
    fontWeight: 'bold', 
    width: 40, 
    top: 0, 
    left: 140, 
    position:'absolute', 
    background: 'skyblue', 
    WebkitUserSelect: 'none' 
});

$('#Autoplay').css({ 
    fontWeight: 'bold', 
    left: 190, 
    position: 'absolute',
    background: 'LimeGreen' 
});

$('#BgImg').css({ 
    width:265, 
    height: 166, 
    top: 35, 
    left: 5, 
    padding: 0, 
    position: 'absolute', 
    pointerEvents: 'none', 
    WebkitUserSelect: 'none' 
});

$('#DictionaryBtn')
    .off('click')  
    .on('click', function() { $("#ReplayBtn").click(); })
    .click();
 
$('.jjo-display').attr('id', 'ROS_Display');
$('.game-input').attr('id', 'ROS_Turn');
$('.jjo-turn-time').attr('id', 'ROS_Time');
$('.GameBox .items').attr('id', 'ROS_Item');
$('.rounds').attr('id', 'ROS_Round');
$('.history').attr('id', 'ROS_History');
 
var $dsp = isMobile && $('div.jjo-display') || $('#ROS_Display'),
    $talk = $('[id^=UserMessage]'), // isMobile && $('#game-input') || $('#Talk'),
    $take = $('#ChatBtn'),
    $turn = $('#ROS_Turn'),
    $time = document.getElementById('ROS_Time'),
    $item = $('#ROS_Item'),
    $round = $('#ROS_Round'),
    $history = $('#ROS_History'),
    $myimg = $('#BgImg'),
    $setkey = $('#Setkey'),
    $sethotkey = $('#SetHotkey'),
    $autoplay = $('#Autoplay');
    
var ko, en, db,
    mode, 
    opts,
    key, 
    hotkey = isMobile ? 18 : 96,
    f, pf, m,
    _Found, _LFound,
    setlock = false,
    lastupdate = 0, lasthistory = 0, lastplay = 0,
    automode = false,
    word_history = [];
    
var observer = new WebKitMutationObserver(function(mutations) {
          mutations.forEach(execute_AI);
    });
var config = { attributes: false, childList: true, subtree: true };
    
const KEYNAME = { 

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

const IMG = [

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

const GAMEMODE = { 

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
        f = $dsp.text();
        f = f.includes('(') ? '(' + f.replace('(', '|') : f.includes(':') ? pf : f;		
        _Found = opts.includes('미션') && ( m = $item.text() ) ? db.match('\\[' + f + '(.*' + m + '.*)+[^다]\\]') : '';		
        if (_Found) while (_Found = db.match('\\[' + f + '(.*' + m + '.*){' + (_LFound = _Found[0]).split(m).length + ',}[^다]\\]'));
        else  _LFound = (db.match('\\[(' + f + '.*[^다])\\]') || '')[0];
       
        (_Found = _LFound) && transmit(_Found.slice(1, -1), _Found, true);
    },
    
    'KKT': function() {
        var d;
        f = $dsp.text();
        f = f.replace((d = f.match(/\((\d)\)/))[0], '');    
        f = f.includes('(') ? '(' + f.replace('(', '|') : f.includes(':') ? pf : f;
        _Found = (db.match('\\[' + f + '.{' + (Number(d[1]) - 2).toString() + '}[^다]\\]') || '')[0];
        _Found && transmit(_Found.slice(1, -1), _Found, true);
    },
    
    'KAP': function() {
        f = $dsp.text();
        f = f.includes('(') ? '(' + f.replace('(', '|') : f.includes(':') ? pf : f;
        _Found = opts.includes('미션') && ( m = $item.text() ) ? db.match('\\[(.*' + m + '.*)+' + f + '\\]') : '';	
        if (_Found)  while (_Found = db.match('\\[(.*' + m  + '.*){' + (_LFound = _Found[0]).split(m).length + ',}' + f + '\\]'));
        else _LFound = (db.match('\\[(.+' + f + ')\\]') || '')[0];
  	
        (_Found = _LFound) && transmit(_Found.slice(1, -1), _Found, true);
    },
    
    'KTY': function() { 
        transmit(opts.includes('속담') ? $dsp.text() : $dsp.text().split(' ')[0], false, false); 
    },
    
    'KDA': function() { 
        console.log('한단-준비중'); 
    },
    
    'KCW': function() { 
        console.log('십자-준비중'); 
    },
    
    'KSS': function() {
        var res = $dsp.html().match(/%;">[가-힣](?=<\/div>)/g).join('').replace(/[^가-힣]/g,'');
        var d, len = 0, chr = '', have = '', rSock = [];
        while (len = res.length) {
            res = res.replace(new RegExp(chr = res[0], 'g'), '');
            rSock.push('\\[(.*' + chr + '.*){' + (len - res.length + 1) + ',}\\]');
	    have += chr;
        }		
        var rSock2 = new RegExp('\\[[' + have + ']{' + (d = opts.includes('2글자 금지') ? 3 : 2) + ',}\\]', 'g');
        var _Found = ((db.match(rSock2) || []).join('\n').replace(new RegExp(rSock.join('|'), 'g'), '').match('\\[[' + have + ']{' + d + ',}\\]') || '')[0];
        _Found && transmit(_Found.slice(1, -1), _Found, false);	
    },
    
    'CSQ': function() { 
        console.log('자퀴-준비중'); 
    },
    
    'HUN': function() {
        f = $dsp.text().slice(1, -1);	
        f = f.includes(':') ? pf : f; 
        var res = f.replace(/([\u1100-\u1112])/g, function($1) { 
            var a = ($1.charCodeAt(0) - 4352) * 588 + 44032; 
	    return '[' + String.fromCharCode(a) + '-' + String.fromCharCode(587 + a) + ']';
        });	
        (_Found = (db.match('\\[' + res + '\\]') || '')[0]) && transmit(_Found.slice(1, -1), _Found, true);	
    },
    
    'ESH': function() {        
        f = $dsp.text();
        f = f.includes('(') ? '(' + f.replace('(', '|') : f.includes(':') ? pf : f;		
        _Found = opts.includes('미션') && ( m = $item.text() ) ? db.match('\\[' + f + '(.*' + m + '.*)+\\]') : '';		
        if (_Found) while (_Found = db.match('\\[' + f + '(.*' + m + '.*){' + (_LFound = _Found[0]).split(m).length + ',}\\]'));
        else  _LFound = (db.match('\\[(' + f + '.+)\\]') || '')[0];
       
        (_Found = _LFound) && transmit(_Found.slice(1, -1), _Found, true);
    },
    
    'EKT': function() {
        f = $dsp.text();
        f = f.includes('(') ? '(' + f.replace('(', '|') : f.includes(':') ? pf : f;
        _Found = opts.includes('미션') && ( m = $item.text() ) ? db.match('\\[' + f + '(.*' + m + '.*)+\\]') : '';
        if (_Found)  while (_Found = db.match('\\[' + f + '(.*' + m + '.*){' + (_LFound = _Found[0]).split(m).length + ',}\\]'));
        else _LFound = (db.match('\\[(' + f + '.+)\\]') || '')[0];
        	
        (_Found = _LFound) && transmit(_Found.slice(1, -1), _Found, true);
    },
    
    'ETY': function() { 
        transmit(opts.includes('속담') ? $dsp.text() : $dsp.text().split(' ')[0], false, false); 
    },
    
    'EDA': function() { 
        console.log('영단-준비중'); 
    },
    
    'ESS': function() {
        var res = $dsp.html().match(/%;">\w(?=<\/div>)/g).join('').replace(/[^a-z]/g,'');
        var len = 0, chr = '', have = '', rSock = [];
        while (len = res.length) {
            res = res.replace(new RegExp(chr = res[0], 'g'), '');
            rSock.push('\\[(.*' + chr + '.*){' + (len - res.length + 1) + ',}\\]');
	    have += chr;
        }
        rSock.unshift('\\[[' + have + ']*([^' + have + '][' + have + '?]) + \\]');
        var _Found = (db.replace(new RegExp(rSock.join('|'), 'g'), '').match('\\[[' + have + ']{' + (opts.includes('2글자 금지') ? 3 : 2) + ',}\\]') || '')[0];
        _Found && transmit(_Found.slice(1, -1), _Found, false);
    }
    
};

$round.on('DOMSubtreeModified', function() {
    if (new Date().getTime() - lastupdate < 5555) return false; 

    opts = $('h5.room-head-mode').html().split(' / ');
    if (!opts) return false;
    
    mode = GAMEMODE[opts.splice(0, 1)];
    db = /E../.test(mode) ? (en || (en = readUrl('En'))) : (ko || (ko = readUrl('Ko.txt')));
    console.log('[New Game]\nmode: ' + mode + '\nopts: ' + opts + '\n  ');
    lastupdate = new Date().getTime();
    playing = false;
    changeImage();
});

$autoplay.on({
    click: function() { 
        control_AI(automode = !automode);
        $autoplay.css({ background: automode ? 'RoyalBlue' : 'LimeGreen' });
        console.log('AutoMode: ' + automode);
    },
    mouseover: function() { 
        $(this).css({ color: 'Red' }); 
    },
    mouseout: function() { 
        $(this).css({ color: '' }); 
    }
});

$history.on('DOMSubtreeModified',  function() {
     if (new Date().getTime() - lasthistory < 150) return false;

     var stuff, trash;
     if (!(stuff = $(this).html()) || word_history.includes(trash = stuff.split('<')[1].split('>')[1])) {
          lasthistory = new Date().getTime();
          return false;
     }
     console.log('fire - history');
     word_history.push(trash);
     db = db.replace('[' + trash + ']', '');
     lasthistory = new Date().getTime();
});

$setkey.on({ 
    keydown: function(e) {
        e.stopPropagation();
        e.preventDefault();
        if (setlock) return false; 

	key = e.keyCode;
        $setkey.val(KEYNAME[key] || String.fromCharCode(key));
    },
    dblclick: function() { 
        if (setlock) { 
	    setlock = false; 
	    $(this).css({ background: '' }); 
	}
    }
});

$sethotkey.on({
    click: function() {
        if (setlock) return false;

        hotkey = key;
        $setkey.css({ background: 'Pink' });
        setlock = true;
        console.log('Hotkey Modified: ' + (KEYNAME[key] || String.fromCharCode(key)));
    },
    mouseover: function() { 
        $(this).css({ color: 'Red' }); 
    },
    mouseout: function() { 
        $(this).css({ color: '' }); 
    }
});

$(window).on('keydown', function(e) {
    if (e.keyCode === hotkey && ($turn.is(':visible') || /(K|E)SS/.test(mode))) {
        e.preventDefault();
        var start = new Date().getTime();
        PLAY[mode]();
        console.log(new Date().getTime() - start);
    }
});

function control_AI(plug) {
    plug ? observer.observe($time, config) : observer.disconnect();
}

function execute_AI(mutation) {
     if ($turn.is(":visible")) {
          control_AI(false);
          console.log('mutate');
          PLAY[mode]();
	  setTimeout(function() { 
               control_AI(true); 
	  }, 100);
     }
}

function transmit(msg, erase, memo) {
    if ($turn.is(":visible") || /(K|E)SS/.test(mode)) {
        $talk.val(msg);
	$take.click();
	erase && (db = db.replace(erase, ''));
	memo && (pf = f);
    }
}

function sleep(delay) { 
    var start = new Date().getTime(); 
    while ( new Date().getTime() < start + delay ); 
}

function changeImage() { 
    var tempsrc = Math.floor(Math.random() * IMG.length); 
    $myimg.attr('src', tempsrc === IMG.indexOf($myimg.attr('src')) ? changeImage() : IMG[tempsrc]); 
}

function shuffle(deck) {
    var wasArray = Array.isArray(deck);
    var arr = wasArray ? deck : deck.split('\n');
    var curindex = arr.length, tempvalue, rndindex;
    while (0 !== curindex) {
        rndindex = Math.floor(Math.random() * curindex);
        tempvalue = arr[--curindex];	
        arr[curindex] = arr[rndindex];	
        arr[rndindex] = tempvalue;
    }
    return wasArray ? arr : arr.join('\n');
}

function readUrl(Url) { 
    return $.ajax({ 
        type: "GET", 
	url: 'https://raw.githubusercontent.com/Rosantex/my/master/' + Url, 
	async: false
    }).responseText;
}

</script>
