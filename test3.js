(function() {

    $('head').append('<link rel="stylesheet" href="https://cdn.rawgit.com/Rosantex/my/dce8dab5/hack.css" />');
    
    var GUI = $('<div id="GUI"><button id="fireBtn" class="gui_btn" style="-webkit-animation:hue2 60s infinite linear">FIRE</button><button id="autoBtn" class="gui_btn" style="-webkit-animation:hue 60s infinite linear">AUTO</button></div>').appendTo(document.body);
    var mobile = !!$('#mobile').html();
    var screen = mobile ? $('div.jjo-display').attr('readonly', true) : $('.jjo-display'),
        _talk = $('[id^=UserMessage]'),
        talk = mobile ? $('#game-input').attr('readonly', true) : _talk.length ? _talk : $('#Talk'),
        turn = document.querySelector('.game-input'),
        time = $('.jjo-turn-time'),
        item = $('.GameBox .items'),
        round = $('.rounds'),
        record = $('.history');
    var ko, en, db,
        mode, opts, pf,
        lastRound = 0,
        lastRecord = 0,
        lastPlay = 0,
        autoPlay = false,
        stack = [];
    var mutate = 'DOMSubtreeModified';
    var enter = $.Event('keydown', {
        keyCode: 13
    });
    var GAMEMODE = {
        '한국어 끝말잇기': 'KSH',
        '한국어 쿵쿵따': 'KKT',
        '한국어 앞말잇기': 'KAP',
        '한국어 타자 대결': 'KTY',
        '한국어 솎솎': 'KSS',
        '훈민정음': 'HUN',
        '영어 끝말잇기': 'ESH',
        '영어 끄투': 'EKT',
        '영어 타자 대결': 'ETY',
        '영어 솎솎': 'ESS'
    };
    var PLAY = {
        'KSH': function() {
            var f, m, tmp, res;
            
            f = screen.text();
            f = ~f.indexOf('(') ? '(' + f.replace('(', '|') : f.includes(':') ? pf : f;
            tmp = opts.includes('미션') && (m = item.text()) ? db.match('\\[' + f + '(.*' + m + '.*)+[^다]\\]') : '';
            if (tmp)
                while (tmp = db.match('\\[' + f + '(.*' + m + '.*){' + (res = tmp[0]).split(m).length + ',}[^다]\\]'));
            else res = (db.match('\\[(' + f + '.*[^다])\\]') || '')[0];

            if (res) send(res.slice(1, -1), res, f);
        },
        'KKT': function() {
            var f, d, res;
            
            f = screen.text();
            f = f.replace((d = f.match(/\((\d)\)/))[0], '');
            f = ~f.indexOf('(') ? '(' + f.replace('(', '|') : f.includes(':') ? pf : f;
            res = (db.match('\\[' + f + '.{' + (+d[1] - 2 + '') + '}[^다]\\]') || '')[0];
            if (res) send(res.slice(1, -1), res, f);
        },
        'KAP': function() {
            var f, m, tmp, res;
            
            f = screen.text();
            f = ~f.indexOf('(') ? '(' + f.replace('(', '|') : f.includes(':') ? pf : f;
            tmp = opts.includes('미션') && (m = item.text()) ? db.match('\\[(.*' + m + '.*)+' + f + '\\]') : '';
            if (tmp)
                while (tmp = db.match('\\[(.*' + m + '.*){' + (res = tmp[0]).split(m).length + ',}' + f + '\\]'));
            else res = (db.match('\\[(.+' + f + ')\\]') || '')[0];

            if (res) send(res.slice(1, -1), res, f);
        },
        'KTY': function() {
            send(~opts.indexOf('속담') ? screen.text() : /\S+/.exec(screen.text()));
        },
        'KSS': function() {
            var t = screen.html().match(/%;">[가-힣](?=<\/div>)/g).join('').replace(/[^가-힣]/g, '');
            var d, len = 0,
                chr = '',
                chrs = '',
                reg = [],
                reg2, res;
                
            while (len = t.length) {
                t = t.split(chr = t[0]).join('');
                reg.push('\\[(.*' + chr + '.*){' + (len - t.length + 1) + ',}\\]');
                chrs += chr;
            }
            reg2 = new RegExp('\\[[' + chrs + ']{' + (d = opts.includes('2글자 금지') ? 3 : 2) + ',}\\]', 'g');
            res = ((db.match(reg2) || []).join('\n').replace(new RegExp(reg.join('|'), 'g'), '').match('\\[[' + chrs + ']{' + d + ',}\\]') || '')[0];
            
            if (res) send(res.slice(1, -1), res);
        },
        'HUN': function() {
            var f, t, res;
            
            f = screen.text().slice(1, -1);
            f = ~f.indexOf(':') ? pf : f;
            t = f.replace(/[\u1100-\u1112]/g, function(j) {
                var a = (j.charCodeAt(0) - 4352) * 588 + 44032;
                return '[' + String.fromCharCode(a) + '-' + String.fromCharCode(587 + a) + ']';
            });
            if (res = (db.match('\\[' + t + '\\]'))) send(res.slice(1, -1), res, f);
        },
        'ESH': function() {
            var f, m, tmp, res;
            
            f = screen.text();
            f = ~f.indexOf('(') ? '(' + f.replace('(', '|') : f.includes(':') ? pf : f;
            tmp = opts.includes('미션') && (m = item.text()) ? db.match('\\[' + f + '(.*' + m + '.*)+\\]') : '';
            if (tmp)
                while (tmp = db.match('\\[' + f + '(.*' + m + '.*){' + (res = tmp[0]).split(m).length + ',}\\]'));
            else res = db.match('\\[(' + f + '.+)\\]');

            if (res) send(res.slice(1, -1), res, f);
        },
        'EKT': function() {
            var f, m, tmp, res;
            
            f = screen.text();
            f = ~f.indexOf('(') ? '(' + f.replace('(', '|') : f.includes(':') ? pf : f;
            tmp = opts.includes('미션') && (m = item.text()) ? db.match('\\[' + f + '(.*' + m + '.*)+\\]') : '';
            if (tmp)
                while (tmp = db.match('\\[' + f + '(.*' + m + '.*){' + (res = tmp[0]).split(m).length + ',}\\]'));
            else res = db.match('\\[(' + f + '.+)\\]');

            if (res) send(res.slice(1, -1), res, f);
        },
        'ETY': function() {
            this['KTY']();
        },
        'ESS': function() {
            var t = screen.html().match(/%;">\w(?=<\/div>)/g).join('').replace(/[^a-z]/g, ''),
                i = 0,
                cnt = 0, 
                count = ['', '', '', '', '', '', ''],
                chr, tmp, reg, res;
            
            while (i < 26) {
                chr = String.fromCharCode(i++ + 97);
                cnt = t.split(chr).length - 1;
                if (cnt < 7) count[cnt] += chr;
            }
            
            i = 1;
            tmp = count.map(function(ch, c) {
                return ch ? '\\w*?([' + ch + '])(?:\\w*?\\' + i++ + '){' + c + '}' : '';
            }).filter(function(r) {
                return r;
            }).join('|');
            
            reg = new RegExp('\\[(?:' + tmp + ')\\w*\\]', 'g');
            res = db.replace(reg, '').match(/\[\w+\]/);
            
            if (res) send(res.slice(1, -1), res);
        },
        'NOP': function() {
            // alert('Not Supported');
        }
    };
    
    function setObserver() {
        time.one(mutate, execute);
    }
    
    function execute() {
        if (turn.style.display === 'block' && +new Date() - lastPlay > 150) {
            PLAY[mode]();
            lastPlay = +new Date();
        }
        if (autoPlay) setObserver();
    }
     
    function onNewRound() {
        if (+new Date() - lastRound < 5000) return false;

        opts = $('h5.room-head-mode').html().split(' / ');
        if (!opts) return false;

        mode = GAMEMODE[opts.shift()] || 'NOP';
        db = mode[0] === 'E' ? en : ko;
        lastRound = +new Date();
    }
    
    function onNewRecord() {
        var stuff, trash;
        
        if (+new Date() - lastRecord < 200) return false;
        if (!(stuff = this.innerHTML) || stack.includes(trash = stuff.split('<')[1].split('>')[1])) {
            lastRecord = +new Date();
            return false;
        }
        stack.push(trash);
        db = db.replace('[' + trash + ']', '');
        lastRecord = +new Date();
    }
    
    function send(wd, used, fChar) {
        var isSock = mode.slice(1) === 'SS',
            input = isSock ? _talk : talk;
    
        if (turn.style.display === 'block' || isSock) {
            input.val(wd).trigger(enter);
            if (used) db = db.replace(used, '');
            if (fChar) pf = fChar;
        }
    }
    
    function ajax(url) {
        return $.ajax('https://raw.githubusercontent.com/Rosantex/my/master/' + url);
    }
    
    $('#autoBtn').click(function() {
        autoPlay = !autoPlay;
        if (autoPlay) {
            setObserver();
            this.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
        } else {
            this.style.backgroundColor = '';
        }
    });
    $('#fireBtn').on({
        touchstart: function() {
            if (turn.style.display === 'block' || /SS$/.test(mode)) PLAY[mode]();
            this.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
        },
        touchend: function() {
            this.style.backgroundColor = '';
        }
    });
    $('#DictionaryBtn').off().click(function() {
        GUI.toggle();
    });

    ajax('Ko.txt').then(function(res) {
        ko = res;
    });
    ajax('En').then(function(res) {
        en = res;
    });
    record.on(mutate, onNewRecord);
    round.on(mutate, onNewRound);

})();
