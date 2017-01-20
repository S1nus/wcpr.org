var STREAM_URLS = [
    {
        'name': 'Low - 128kbps',
        'type': 'mp3',
        'url': 'http://740.wcpr.org:8080/stream128.mp3'
    },
    {
        'name': 'High - 320kbps',
        'type': 'mp3',
        'url': 'http://740.wcpr.org:8080/stream320.mp3'
    }
];
var player_obj = $("#streaming_player"),
    was_playing = false;

player_obj.jPlayer({
    ready: function () {
        setMediaURL(0);
    },
    swfPath: '/static/bower_components/jPlayer/dist/jquery.jplayer.swf',
    cssSelectorAncestor: "#jp_container_1",
    solution: "html,flash",
    useStateClassSkin: true,
    autoBlur: false,
    smoothPlayBar: true,
    keyEnabled: true
});

player_obj.bind($.jPlayer.event.canplay, function() {
    $('#play_disabled').addClass('hidden');
    $('#jp_container_1').removeClass('hidden');
    if (was_playing) {  // occurs when a user changes quality while playing
        $(player_obj).jPlayer('play');
    }
});

player_obj.bind($.jPlayer.event.play, function() {
    was_playing = true;
});

player_obj.bind($.jPlayer.event.pause, function() {
    was_playing = false;
});

function setMediaURL(index) {
    var params = {
        title: 'WCPR - Castle Point Radio'
    };
    params[STREAM_URLS[index]['type']] = STREAM_URLS[index]['url'];

    $(player_obj).jPlayer("setMedia", params);
}

function onMediaSelectClick() {
    if ($(this).hasClass('selected')) {
        return;
    }
    var quality_buttons = document.getElementsByClassName('stream-quality-btn'),
        selected_index = this.getAttribute('data-index');
    // change the media stream to the selected one
    setMediaURL(parseInt(selected_index));
    // hide the play button until the media is loaded
    $('#jp_container_1').addClass('hidden');
    $('#play_disabled').removeClass('hidden');

    // change the quality buttons so the correct one has a checkmark and no others do
    for (var i = 0; i < quality_buttons.length; i++) {
        if (quality_buttons[i].getAttribute('data-index') == selected_index) {
            quality_buttons[i].className = 'stream-quality-btn selected';
        }
        else {
            quality_buttons[i].className = 'stream-quality-btn';
        }
    }
}

function generateQualityButtons() {
    /* Generate buttons to pick the quality from each option in STREAM_URLS.

     The format of a button is:
     <li>
         <a href="javascript:void(0)" className="stream-quality-btn"
            onclick="onMediaSelectClick()" data-index="{INDEX}">
             {NAME} <i class="fa fa-fw fa-check"></i>
         </a>
     </li>

     */
    var container = document.getElementById('quality_select_dropdown'),
        i, li_elem, a_elem;

    for (i = 0; i < STREAM_URLS.length; i++) {
        li_elem = document.createElement('li');

        a_elem = document.createElement('a');
        a_elem.onclick = onMediaSelectClick;
        a_elem.innerHTML = STREAM_URLS[i]['name'] + ' <i class="fa fa-fw fa-check"></i>';
        a_elem.setAttribute('href', 'javascript:void(0);');
        a_elem.setAttribute('data-index', '' + i);

        if (i == 0) {
            a_elem.className = 'stream-quality-btn selected';
        }
        else {
            a_elem.className = 'stream-quality-btn'
        }

        li_elem.appendChild(a_elem);
        container.appendChild(li_elem);
    }
}

// When page is loaded, generate the quality buttons.
generateQualityButtons();