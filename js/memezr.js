'use strict';

var MEME_API_URL = "/js/memezr-data.json";
const DYNAMIC_CACHE_KEY = "memezr-dinamic";

let sw;
let installTrigger;

$(document).ready(memezr_init);

function memezr_init() {
    register_service_worker();
    meme_api_gimme(meme_api_gimme_ok);
}

function meme_api_gimme_ok(memes) {
    memes = memes.memes;
    cache_memes(memes)

    for(var i = 0; i < memes.length; i++) {
        var meme = memes[i];
        $("#memes-list").append(new_meme_item(meme));
    }
}

function new_meme_item(meme) {
    var meme_item = $( $("#meme-template").html() );
    $(meme_item).find(".meme-img").attr("src", meme.url);
    $(meme_item).find(".meme-img").attr("alt", meme.title);
    $(meme_item).find(".meme-title").html(meme.title);
    $(meme_item).removeClass("hidden");
    
    return meme_item.get(0);
}

function register_service_worker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            sw = registration;
            $("#install-button").click(function() {
                installTrigger.prompt();
            });
        });
    }
}

function cache_memes(memes) {       
    if ('caches' in window) {
        caches.open(DYNAMIC_CACHE_KEY).then(function(cache) {
            cache.addAll([ MEME_API_URL ]);
            for(var i = 0; i < memes.length; i++) {
                var meme = memes[i];
                cache.add(meme.url);
            }
        });
    }
}

function meme_api_gimme(callback) {
	$.ajax({
		type: "GET",
		async: true,
		url: MEME_API_URL,
		contentType: "application/json; charset=utf-8",
	    dataType: 'json',
		success: callback
	});
}

window.addEventListener('beforeinstallprompt', (evt) => {
    installTrigger = evt;
});