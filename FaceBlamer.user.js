// ==UserScript==
// @name         FaceBlamer
// @namespace    FaceBlamer
// @description  We don't like, we blame.
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @include      http://*.facebook.com/*
// ==/UserScript==
var strings = {
    fr: {
        'like_substitution': new Array(/aime/, 'blâme'),
        'like': 'Blâme',
        'unlike': 'Disculper'
    },
    en: {
        'like_substitution': new Array (/like/, 'blame'),
        'like': 'Blame',
        'unlike': 'Unblame'
    }
};

lang = document.getElementById('facebook').getAttribute('lang');
if (!strings[lang]) {
    lang = 'en'
}

var blameThumbs =
   "iVBORw0KGgoAAAANSUhEUgAAABEAAAAbCAIAAAAVlPPLAAAAAXNSR0IArs4c6QAAAAlwSFlzAAA"
 + "LEwAACxMBAJqcGAAAAAd0SU1FB9wEAQokI7oMolMAAAGpSURBVDjLpVRLS0JREP4mXBVEohIVZX"
 + "el7coITIWoXRBGEsjVFj0W/YAeEK5d9YCKIMF7WyUYIdWmiBaC1aLCIGnhSuy5qEX0B6bFiWteU"
 + "7Rmce9h5nwz8835ziFmRo1Wh9rNIH5ToaNs7h0EAIebfiJc3T0nr/Op9CMROlsaN0LDZmOD2Eyi"
 + "N1dA9TjaAUql8wCIyNPTMTpoc/e2i32Buf3Y6nhRne8EABFd7k6X9pN7/dTz4e8vlxsJlfIB0Nb"
 + "cWBItGIP1GLtkip/cMzMRuYIqAF2HRD9ycRnrlxWxcMqKU44urZ1pobIYNXG7sHzKzE45qguVPd"
 + "Opse5U+gEAlTCspAO7ZAFgMtbXgNkJe11BtYj9Tx38RW8AZkKJbO5NrA+2JgBcZ56SV7mLdF44r"
 + "a1N66ERs7GhUMcTiLgdVgDaJrfD6h3qEk5hwfn47orf8Gv189jsr/78y8cf788/7lyxTKvG2CTL"
 + "3nFGm0cFVgWMEvbpYp5ARMBECgADfVIlXTPzTuJmcfmYmd3ydlUaBTA51qudVQ1zs0kWANqLUxV"
 + "GCfs0Mv/S6BcHCPv82ArwwAAAAABJRU5ErkJggg=="
;

var blame_button = function (index) {
    
    var str = strings[lang];
    var re  = /unlike/;
    
    if (re.test($(this).attr('name'))) {
        //Unlike --> exculpation.
        $(this).find('.default_message').html(str['unlike']);
        $(this).find('.saving_message').html(str['like']);
    } else {
        //Like --> blame.
        $(this).find('.default_message').html(str['like']);
        $(this).find('.saving_message').html(str['unlike']);
    }
}

function blame() {

    // Blame post and comments on post.

    $('.like_link').each(blame_button);
    $('.cmnt_like_link').each(blame_button);

    // "You and 5 others blame this".
    $('.UIImageBlock_ICON_Content').contents().filter(function() {
        return this.nodeType == 3
    }).wrap("<span id='blame'></span>");

    var s = strings[lang]['like_substitution'];
    
    $('.UIImageBlock_ICON_Content span').text(function (i, txt) {
    //$('blame').text(function (i, txt) {
        GM_log(txt.replace(s[0], s[1]));
        return txt.replace(s[0], s[1]);
    });
    
    var blameCss = {
        'background-image': 'url(data:image/png;base64,' + blameThumbs + ')',
        'background-position': '0px 0px'
    };
    $('.uiUfiLikeIcon').css(blameCss);
}


var content = document.getElementById('content');

if (content) {
    var t;

    content.addEventListener('DOMNodeInserted', function() {
        clearTimeout(t);
        t = setTimeout(blame, 100);
    }, false);
}