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
        'like_substitution': new Array(/like/, 'blame'),
        'like': 'Blame',
        'unlike': 'Unblame'
    }
};

lang = document.getElementById('facebook').getAttribute('lang');
if (!strings[lang]) {
    lang = 'en'
    
    
}

var refresh_rate = 10;
var slow_flag = 1;
var do_ads = true;

var ads = [
    {
        title : 'Hammer',
        body  : "If I had a hammer, I'd smash the patriarchy",
        img   : "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABIMDhAOCxIQDxAUExIVGy0dGxkZGzcoKiEtQjpFREA6Pz5IUWhYSE1iTj4/WntcYmtvdHZ0RleAiX9xiGhydHD/2wBDARMUFBsYGzUdHTVwSz9LcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHD/wAARCABIAGMDASIAAhEBAxEB/8QAGQABAAMBAQAAAAAAAAAAAAAAAAQFBgID/8QAMhAAAgIBAgMFBQgDAAAAAAAAAAECAwQRIQUxURITMkFhFCJxgeEGFSNCscHR8DNikf/EABgBAQADAQAAAAAAAAAAAAAAAAABAwQC/8QAGhEBAQEBAQEBAAAAAAAAAAAAAAECETEDEv/aAAwDAQACEQMRAD8A3AAAEbLz8XD09oujBtapc2/ktyH9o+KfdfD1ZBx72yahDX15vT0RQ4eFO7I77Ik5Tk9X292/iRbxMnWghx/hsn/mkvjXL+CdRk0ZCfc2wnpz0fIhYfDsB1aLHhKUdpN6t6/Ml42Hj4spyoqUHPxaeYiHuACQAAAAAAAAEtWno9H1AAydXBsuealmWWX5M7W5ZGj0rrXlHXZN7Lbl8i8u4XXGPaxX3VijotXqpdNdf1LAEcOs9w+2zFyJxtTjan70X5r++Zf1WQtrU4PtRfJkbiGDDLrTT7NsfBP9n6FZh5VmLfKuyLTT9+H7r+7lHb8ry+Lufudnq+BzVZC2CnB6xZ0aFIAAAAAAAAAAAAAEHieF7TDt17XQW3+y6E4HOszU5Uy2XsZ7CzJ0z6PlKL21/hl7RdC+vtwe3Jp80+jIHE+H95P2miP4i8UV+f6kPHyZ02qyvfXaUXt2vT49GZs6vy1+deLrJ9J2er8HnRdC+pWVvVP/AKn0Z6GtQAAAAAAAAAAAAABWcSwO1L2ihe8vFFea6r1LMHO8Tc5XWdXN7FBi5Trt7yrVt7Tg/wA316dS8pthfUrK3rFldxLB0csiiPPxxXn6kPGyLKJ95X72vjhr4vr+plzu/LX414u1mbn6y0AOapq2uNkddJJNarRnRsZwAAAAAAAAAAAAAIa4dSsp3LaL5w8tQDm5mvUy2eJgAOkAAA//2Q=="
    },
    {
        title : 'BlamerAir',
        body  : "Direct daily flights to Savage Death Island",
        img   :
          "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"
    },
    {
        title : 'Margs',
        body  : "You need one in the worst way.",
        img   : "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCABIAGMDASIAAhEBAxEB/8QAGwABAAIDAQEAAAAAAAAAAAAAAAYHAwQFAgj/xAAxEAABBAEDAgQFAgcBAAAAAAABAAIDBBEFEiEGMRNBUXEUIjJhgQeRJFKho7HR4fD/xAAaAQEAAwADAAAAAAAAAAAAAAAAAQIDBAUG/8QAIxEAAwACAQQBBQAAAAAAAAAAAAECAxEEBRIhMRMiQVGBkf/aAAwDAQACEQMRAD8A+y0REARFxNb1+HTLorSuhY5zN7d7uSPb8FAdtFFLVp9+MWjcbGzghokLduPY/c/+wtOLqw1ImtfainOQ0CT6hnzJHGB5qHUz7aBNyo1q/UbmFzKAiyCAJZAXNPODhoIyB65WhqHVMjtOnMdrTA58bsYnw9uQe3Pf7KvZeoPDY6MAEEAN7fL7HC63qHKrHK+Ol/UPH3LB0zrGWO/Wq6vFB4Vp4jit1wWtD3HDWvYSSAcgB2SMkAgcFTVUPrUjZ+h9QMjSS6uQ3vl0vZgA9dxbj74V6w7/AAm7/qwM+6npvJvND7/Oiir63P7PaIi7IuEREAREQBRb9QdAn1apDZosa63XJw0kDe09x7/9UpRUyY5yS5r0yGtoqGxY1CKBtaSrNAQ0B7XsI5XGnjmkcdsbyfPAVlfqbTZNptOwcgx2mtc4HB2uBGP32qP2tLY1obHNOW4zzIV5DrHF+B722jl8beRuWQWZ0rDsMbs9uy3tC6K13XLnxEdb4Ws1pO+yCwPd5Y4z684/0ZPoOkQSdR0I5Q57RLv2kkj5QXc/kBWkBgLTpfSJzT8uVvX4M8789pX/AE10Hdh1Gvb1u1WENSXxYadTcWOkH0ySSOALsHkNDQAQCS7jFgIi9ThwxhnthaRx5lSERFqWCIiAIiIAiIgNPWqEWp6bLSlOA8Ah38rgctP4ICiNqalp0xpX5HtsMYCQ2JzgR6ggchTpRzqSOJurQmRocLcIgf7CVgA/uFYZ+LHIWqRM28b3Jm6d0sQyjUHkhz2YjaW4IacHJzyDwOPLz+3dQItZlStIj35CIisAiIgCIiAIiIAiIgCifW1nw9d0SED65Wkn0/iK/wDnn9ipZlVr1nq0knUVttdk0kdZkLI3wNa/a8OeXu5I5BcwYPmz8LTGt0UyUkiygiw0bMNypFarvD4pWhzSFmWZcIiIAiIgCIiAIiIAiIgOHqmkXrYnYbjJYJD8sTt0bhnuPEae3p8vvnuuDQ6INdkm2tVhJduDGW5HBxz3J2Aj+vdEVlbS0VcJvbOppWi6nUjlhiFOo15Lw8TvnIceSdpazz+6kFGKaGqyOxY+IlA+eTbt3H7DyH7+57oih037JS0ZkRFBIREQBERAf//Z"
    },
    {
        title : 'Heartwarming nature crap',
        body  : "Donkeys, mushrooms and stuff like that",
        img   :"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"
    },
    {
        title : 'Feminist girl',
        body  : "Is not amused",
        img   : "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"
    },
    {
        title : 'Protect your privacy',
        body  : "From spying cats",
        img   : "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"
    }
];

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
  + "GCfs0Mv/S6BcHCPv82ArwwAAAAABJRU5ErkJggg==";
  
var mothership = 'http://blog.iblamethepatriarchy.com';

function shuffle(a, b) {
    return (parseInt(Math.random() * 10) % 2);
}

var blame_button = function(index) {

    var str = strings[lang];
    var re = /unlike/;

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

    $('.UIImageBlock_ICON_Content span').text(function(i, txt) {
        return txt.replace(s[0], s[1]);
    });

    // Thumbs down.
    var blameCss = {
        'background-image': 'url(data:image/png;base64,' + blameThumbs + ')',
        'background-position': '0px 0px'
    };
    $('.uiUfiLikeIcon').css(blameCss);


    if (do_ads == true) {
        
        var shuffled_ads = ads.sort(shuffle).slice();
        
        var swap_ad = function() {
            
            if (shuffled_ads.length == 0) { return };
            var ad = shuffled_ads.pop();
            
            //$(this).find('.clearfix').remove();
            
            $(this).find('.title').html(ad.title);
            $(this).find('.body').html(ad.body);
            $(this).find('.fbEmuContext').remove();
            $(this).find('.adInfo a').remove();
            //$(this).find('.adInfo a').removeAttr('onmousedown');
            //$(this).find('.adInfo a').attr('href', mothership );
            $(this).find('.emuEvent1').removeAttr('onmousedown');
            $(this).find('.emuEvent1').attr('href', mothership);
            //$(this).find('.emuEvent1').text('Blame');
            
            var data_url =  'data:image/jpg;base64,' + ad.img ;
            $(this).find('.img').attr('src',data_url);
        };
        
        ad_divs = $('.fbEmuTitleBodyImageDiv');
        //GM_log(ad_divs + ' ' + ad_divs.length);
        
        if (ad_divs.length > 0) {
            ad_divs.each(swap_ad);
            do_ads = false;
        }
    }
    //slow_flag++;
}


var content = document.getElementById('content');

if (content) {
    var t;
    
    //blame();
    
    //var interval = slow_flag > 3 ? 100 : 10;

    content.addEventListener('DOMNodeInserted', function() {
        clearTimeout(t);
        t = setTimeout(blame, 100);
    }, false);
}