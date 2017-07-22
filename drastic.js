(function() {

    $('head').append('<link rel="stylesheet" href="https://cdn.rawgit.com/Rosantex/my/dce8dab5/hack.css" />');
    
    var GUI = $('<div id="GUI"><button id="fireBtn" class="gui_btn" style="-webkit-animation:hue2 60s infinite linear">FIRE</button><button id="autoBtn" class="gui_btn" style="-webkit-animation:hue 60s infinite linear">AUTO</button></div>').appendTo(document.body);

    $('#DictionaryBtn')
        .off()
        .click(function() {
            GUI.toggle();
        });

    var mobile = !!$('#mobile').html();
    var screen = mobile ? $('div.jjo-display').attr('readonly', true) : $('.jjo-display'),
        _talk = $('[id^=UserMessage]'),
        talk = mobile ? $('#game-input').attr('readonly', true) : _talk.length ? _talk : $('#Talk'),
        turn = $('.game-input'),
        time = document.querySelector('.jjo-turn-time'),
        item = $('.GameBox .items'),
        round = $('.rounds'),
        record = $('.history');
    var ko, en, db,
        mode, opts,
        f, pf,
        lastupdate = 0,
        lasthistory = 0,
        automode = false,
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
            var m, res, tmp;
            
            f = screen.text();
            f = f.includes('(') ? '(' + f.replace('(', '|') : f.includes(':') ? pf : f;
            res = opts.includes('미션') && (m = item.text()) ? db.match('\\[' + f + '(.*' + m + '.*)+[^다]\\]') : '';
            if (res)
                while (res = db.match('\\[' + f + '(.*' + m + '.*){' + (tmp = res[0]).split(m).length + ',}[^다]\\]'));
            else tmp = (db.match('\\[(' + f + '.*[^다])\\]') || '')[0];

            if (res = tmp) send(res.slice(1, -1), res, true);
        },
        'KKT': function() {
            var d, res;
            f = screen.text();
            f = f.replace((d = f.match(/\((\d)\)/))[0], '');
            f = f.includes('(') ? '(' + f.replace('(', '|') : f.includes(':') ? pf : f;
            res = (db.match('\\[' + f + '.{' + (+d[1] - 2 + '') + '}[^다]\\]') || '')[0];
            if (res) send(res.slice(1, -1), res, true);
        },
        'KAP': function() {
            var m, res, tmp;
            f = screen.text();
            f = f.includes('(') ? '(' + f.replace('(', '|') : f.includes(':') ? pf : f;
            res = opts.includes('미션') && (m = item.text()) ? db.match('\\[(.*' + m + '.*)+' + f + '\\]') : '';
            if (res)
                while (res = db.match('\\[(.*' + m + '.*){' + (tmp = res[0]).split(m).length + ',}' + f + '\\]'));
            else tmp = (db.match('\\[(.+' + f + ')\\]') || '')[0];

            if (res = tmp) send(res.slice(1, -1), res, true);
        },
        'KTY': function() {
            send(opts.includes('속담') ? screen.text() : /\S+/.exec(screen.text()), false, false);
        },
        'KSS': function() {
            var t = screen.html().match(/%;">[가-힣](?=<\/div>)/g).join('').replace(/[^가-힣]/g, '');
            var d, len = 0,
                chr = '',
                chrs = '',
                rSock = [],
                rSock2, res;
            while (len = t.length) {
                t = t.replace(new RegExp(chr = t[0], 'g'), '');
                rSock.push('\\[(.*' + chr + '.*){' + (len - t.length + 1) + ',}\\]');
                chrs += chr;
            }
            rSock2 = new RegExp('\\[[' + chrs + ']{' + (d = opts.includes('2글자 금지') ? 3 : 2) + ',}\\]', 'g');
            res = ((db.match(rSock2) || []).join('\n').replace(new RegExp(rSock.join('|'), 'g'), '').match('\\[[' + chrs + ']{' + d + ',}\\]') || '')[0];
            if (res) send(res.slice(1, -1), res, false);
        },
        'HUN': function() {
            var t, res;
            f = screen.text().slice(1, -1);
            f = f.includes(':') ? pf : f;
            t = f.replace(/([\u1100-\u1112])/g, function($1) {
                var a = ($1.charCodeAt(0) - 4352) * 588 + 44032;
                return '[' + String.fromCharCode(a) + '-' + String.fromCharCode(587 + a) + ']';
            });
            if (res = (db.match('\\[' + t + '\\]') || '')[0]) send(res.slice(1, -1), res, true);
        },
        'ESH': function() {
            var m, res, tmp;
            f = screen.text();
            f = f.includes('(') ? '(' + f.replace('(', '|') : f.includes(':') ? pf : f;
            res = opts.includes('미션') && (m = item.text()) ? db.match('\\[' + f + '(.*' + m + '.*)+\\]') : '';
            if (res)
                while (res = db.match('\\[' + f + '(.*' + m + '.*){' + (tmp = res[0]).split(m).length + ',}\\]'));
            else tmp = (db.match('\\[(' + f + '.+)\\]') || '')[0];

            if (res = tmp) send(res.slice(1, -1), res, true);
        },
        'EKT': function() {
            var m, res, tmp;
            f = screen.text();
            f = f.includes('(') ? '(' + f.replace('(', '|') : f.includes(':') ? pf : f;
            res = opts.includes('미션') && (m = item.text()) ? db.match('\\[' + f + '(.*' + m + '.*)+\\]') : '';
            if (res)
                while (res = db.match('\\[' + f + '(.*' + m + '.*){' + (tmp = res[0]).split(m).length + ',}\\]'));
            else tmp = (db.match('\\[(' + f + '.+)\\]') || '')[0];

            if (res = tmp) send(res.slice(1, -1), res, true);
        },
        'ETY': function() {
            this['KTY']();
        },
        'ESS': function() {
            var t = screen.html().match(/%;">\w(?=<\/div>)/g).join('').replace(/[^a-z]/g, '');
            var len = 0,
                chr = '',
                chrs = '',
                reg = [],
                res;
            while (len = t.length) {
                t = t.split(chr = t[0]).join('');
                reg.push('\\[(?:.*?' + chr + '){' + (len - t.length + 1) + '}.*?\\]');
                chrs += chr;
            }
            reg.unshift('\\[.*?[^' + chrs + '].*?\\]');
            res = (db.replace(new RegExp(reg.join('|'), 'g'), '')).match('\\[[' + chrs + ']{' + (opts.includes('2글자 금지') ? 3 : 2) + ',}\\]');
            if (res) send(res.slice(1, -1), res, false);
        },
        'NOP': function() {
            // alert('Not Supported');
        }
    };
    
    function setObserver() {
        time.one(mutate, execute);
    }
    
    function execute() {
        if (turn.is(':visible')) PLAY[mode]();
        if (automode) setObserver();
    }
     
    function onNewRound() {
        if (new Date().getTime() - lastupdate < 5000) return false;

        opts = $('h5.room-head-mode').html().split(' / ');
        if (!opts) return false;

        mode = GAMEMODE[opts.shift()] || 'NOP';
        db = mode[0] === 'E' ? en : ko;
        lastupdate = +new Date();
    }
    
    function onNewRecord() {
        var stuff, trash;
        
        if (+new Date() - lasthistory < 300) return false;

        if (!(stuff = this.innerHTML) || stack.includes(trash = stuff.split('<')[1].split('>')[1])) {
            lasthistory = +new Date();
            return false;
        }
        stack.push(trash);
        db = db.replace('[' + trash + ']', '');
        lasthistory = +new Date();
    }
    
    function send(wd, used, memo) {
        var isSock = mode.slice(1) === 'SS',
            input = isSock ? _talk : talk;
    
        if (turn.is(':visible') || isSock) {
            input.val(wd).trigger(enter);
            if (used) db = db.replace(used, '');
            if (memo) pf = f;
        }
    }
    
    function ajax(url) {
        return $.ajax('https://raw.githubusercontent.com/Rosantex/my/master/' + url);
    }
    
    $('#autoBtn').click(function() {
        if (automode = !automode) setObserver();
        this.style.backgroundColor = (automode = !automode) ? 'rgba(255, 0, 0, 0.3)' : '';
    });
    $('#fireBtn').on({
        touchstart: function() {
            if (turn.is(':visible') || /SS$/.test(mode))
                PLAY[mode]();
            
            this.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
        },
        touchend: function() {
            this.style.backgroundColor = '';
        }
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
