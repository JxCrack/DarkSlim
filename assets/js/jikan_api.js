var page = 1; // Page range 1 - inf
var is_api_loaded = false;
var fbox = document.getElementById('latest');
var loadingBar = document.getElementById('loadingBar');


var fd_det_elmnt = document.getElementById('fd_det_index');
var fd_det_content = document.getElementById('fd_det_content');
var det_index = 0; // Action Button Index on Details Window

var debug_mode = {
	'cde' : false // Show log response from the api
}

loadingBar.setAttribute('style', 'width: 5%;opacity: 1.0;');

var latest_anime_settings = {
	"async": false,
	"crossDomain": true,
	"url": "https://api.jikan.moe/v4/seasons/now?page=" + page,
	"method": "GET"
};

$.ajax(latest_anime_settings).done(function (response) {
	is_api_loaded = true; console.log("AniGo is supported by JikanAPI and the host is not the developer of the api, so use it wisely");
	
	if (debug_mode.cde) {
		console.log(response);
	}
	
	response.data.forEach(function(v, i) {
		
		if (i >= 12) {}
		else {
			var item_box = document.createElement('DIV'); item_box.classList.add('items'); item_box.setAttribute('onclick', 'getDetail( ' + response.data[i].mal_id + ' )'); fbox.append(item_box);
			var item_image = document.createElement('IMG'); item_image.classList.add('featured_banner'); item_image.setAttribute('src', response.data[i].images.jpg.large_image_url); item_box.append(item_image);
			
			var item_type = document.createElement('SPAN'); item_type.classList.add('type');
			item_type.innerHTML = response.data[i].type;
			item_box.append(item_type);
			
			var item_score = document.createElement('SPAN'); item_score.classList.add('score');
			if (response.data[i].score == null) {
				item_score.innerHTML = "-";
				item_box.append(item_score);
			}
			else {
				item_score.innerHTML = '<span style="font-size: 16px;top: 2px;right: 6px;margin-right: unset;" class="material-symbols-outlined">star</span>' + response.data[i].score;
				item_box.append(item_score);
			}
			
			if (response.data[i].episodes == null) {
				item_box.setAttribute('title', response.data[i].title + ", Upcoming");
			}
			else {
				item_box.setAttribute('title', response.data[i].title + ", " + response.data[i].episodes + " Episodes");
			}
			var item_title = document.createElement('SPAN'); item_title.classList.add('title'); item_title.innerHTML = response.data[i].title; item_box.append(item_title);
		}
	})
});
		
loadingBar.setAttribute('style', 'width: 100%;opacity: 1.0;');
setTimeout(function() {
	loadingBar.setAttribute('style', 'width: 0%;opacity: 0.0;');
}, 100);

var timeoutInterval = setInterval(function() {
	if (is_api_loaded) {
		window.clearInterval(timeoutInterval);
	}
	else {
		window.clearInterval(timeoutInterval);
		console.error("Timeout passed, something went wrong with JikanAPI, check your internet connection or try again later..");
	}
}, 20000);


var details_data = {};
function getDetail(id = null) {
	// The parents
	var f_detail = document.getElementById("f_detail");
	
	loadingBar.setAttribute('style', 'width: 5%;opacity: 1.0;');
	
	// GET settings
	var details_settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://api.jikan.moe/v4/anime/" + id + "/full",
		"method": "GET"
	};
	
	$.ajax(details_settings).done(function (json) {
	// GET settings
		var eps_profiles = {
			"async": false,
			"crossDomain": true,
			"url": "https://api.jikan.moe/v4/anime/" + json.data.mal_id + "/episodes",
			"method": "GET"
		};
		
		// Set detail banner / image
		f_detail.children[0].setAttribute('src', json.data.images.jpg.large_image_url);
		
		// Set detail scores
		f_detail.children[2].innerHTML = '<span style="font-size: 16px;top: 1px;right: 6px;margin-right: unset;" class="material-symbols-outlined">star</span>' + json.data.score + "&nbsp;&nbsp;/&nbsp;&nbsp;" + (json.data.scored_by / 1000);
		
		// Set detail titles
		f_detail.children[3].children[1].innerHTML = json.data.title;
		f_detail.children[3].children[2].innerHTML = json.data.title_english + "<br>" + json.data.title_japanese;
		
		// Set status if it's airing or not
		if (json.data.airing) {
			f_detail.children[3].children[3].children[0].innerHTML = "Status	: Currently Airing";
		}
		else {
			f_detail.children[3].children[3].children[0].innerHTML = "Status	: Finished Airing";
		}
		
		// Set duration based on duration per episodes
		f_detail.children[3].children[3].children[1].innerHTML = "Duration	: " + json.data.duration;
		
		
		// Set / add studio names to li element
		while (f_detail.children[3].children[3].children[2].firstChild) {
			f_detail.children[3].children[3].children[2].removeChild(f_detail.children[3].children[3].children[2].lastChild);
		}
		f_detail.children[3].children[3].children[2].innerHTML = "Studios	: ";
		json.data.studios.forEach(function(v, i) {
			var span = document.createElement('SPAN');
			if (i < 1) {
				span.innerHTML = json.data.studios[i].name;
			}
			else {
				span.innerHTML = span.innerHTML + ", " + json.data.studios[i].name;
			}
			f_detail.children[3].children[3].children[2].append(span);
		});
		
		// Set duration based on duration per episodes
		f_detail.children[3].children[3].children[3].innerHTML = "Type	: " + json.data.type;
	
		$.ajax(eps_profiles).done(function (json_eps) {
			f_detail.children[3].children[3].children[4].innerHTML = "Episodes	: " + json_eps.data.length + " / " + json.data.episodes + " Episodes Released";
			if (debug_mode.cde) {
				console.log(json_eps);
			}
		});
		
		
		// Set / add genres to a div element
		while (f_detail.children[3].children[4].firstChild) {
			f_detail.children[3].children[4].removeChild(f_detail.children[3].children[4].lastChild);
		}
		
		json.data.genres.forEach(function(v, i) {
			var a = document.createElement('a'); a.innerHTML = json.data.genres[i].name; a.setAttribute('href', json.data.genres[i].url); a.classList.add('button');
			f_detail.children[3].children[4].append(a);
		});
		
		//document.getElementById('fd_synopsis').innerHTML = json.data.synopsis;
		document.getElementById("f_detail").children[5].setAttribute('href', 'https://myanimelist.net/anime/' + json.data.mal_id);
		
		if (debug_mode.cde) {
			console.log(json);
			details_data = json;
		}
		loadingBar.setAttribute('style', 'width: 100%;opacity: 1.0;');
		setTimeout(function() {
			loadingBar.setAttribute('style', 'width: 0%;opacity: 0.0;');
		}, 100);
		
		checkDetailIndex();
	});
		
	f_detail.classList.remove('hidden');
}

function closeDetailDialog() {
	var f_detail = document.getElementById("f_detail");
	f_detail.classList.add('hidden');
		fd_det_content.innerHTML = '';
}

class Debug {
	constructor () {
		
	}
	
	enableDevLogs(bool = false) {
		if (bool == true || bool == 1) {
			if (debug_mode.cde) {
				console.log("Developer Logs is already Enabled");
			}
			else {
			console.log("Developer Logs is Enabled");
			debug_mode.cde = true;
			}
		}
		else if (bool == false || bool == 0) {
			if (debug_mode.cde != true) {
				console.log("Developer Logs is already Disabled");
			}
			else {
			console.log("Developer Logs is Disabled");
			debug_mode.cde = false;
			}
		}
	}
}

function random() {
	loadingBar.setAttribute('style', 'width: 5%;opacity: 1.0;');
	// GET settings
	var details_settings = {
		"async": false,
		"crossDomain": true,
		"url": "https://api.jikan.moe/v4/random/anime",
		"method": "GET"
	};
	
	$.ajax(details_settings).done(function (json) {
		if (debug_mode.cde) {
			console.log("Random result " + json.data.mal_id);
		}
		getDetail(json.data.mal_id);
	});
}

function search(queryText = "") {
	// GET settings
	var details_settings = {
		"async": true,
		"crossDomain": true,
		"url": "https://api.jikan.moe/v4/anime?page=1&limit=24&q=" + queryText + "&sfw=false&letter=" + queryText,
		"method": "GET"
	};
	
	$.ajax(details_settings).done(function (json) {
		if (debug_mode.cde) {
			console.log(json);
		}
	
		json.data.forEach(function(v, i) {
			var item_box = document.createElement('DIV'); item_box.classList.add('items'); item_box.setAttribute('onclick', 'getDetail( ' + json.data[i].mal_id + ' )'); search_result.children[2].append(item_box);
			var item_image = document.createElement('IMG'); item_image.classList.add('featured_banner'); item_image.setAttribute('src', json.data[i].images.jpg.large_image_url); item_box.append(item_image);
			
			var item_type = document.createElement('SPAN'); item_type.classList.add('type');
			item_type.innerHTML = json.data[i].type;
			item_box.append(item_type);
			
			var item_score = document.createElement('SPAN'); item_score.classList.add('score');
			if (json.data[i].score == null) {
				item_score.innerHTML = "-";
				item_box.append(item_score);
			}
			else {
				item_score.innerHTML = '<span style="font-size: 16px;top: 2px;right: 6px;margin-right: unset;" class="material-symbols-outlined">star</span>' + json.data[i].score;
				item_box.append(item_score);
			}
			
			if (json.data[i].episodes == null) {
				item_box.setAttribute('title', json.data[i].title + ", Upcoming");
			}
			else {
				item_box.setAttribute('title', json.data[i].title + ", " + json.data[i].episodes + " Episodes");
			}
			var item_title = document.createElement('SPAN'); item_title.classList.add('title'); item_title.innerHTML = json.data[i].title; item_box.append(item_title);
		});
		
		loadingBar.setAttribute('style', 'width: 100%;opacity: 1.0;');
		setTimeout(function() {
			loadingBar.setAttribute('style', 'width: 0%;opacity: 0.0;');
		}, 100);
	});
}

var search_result = document.getElementById('search_result');
document.getElementById("search_feature").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
	search_result.classList.remove('hidden');
	latest.classList.add('hidden');
	search_result.children[0].innerHTML = 'Searching for "' + document.getElementById("search_feature").value + '"';
	
	while (search_result.children[2].firstChild) {
		search_result.children[2].removeChild(search_result.children[2].lastChild);
	}
	
    search(document.getElementById("search_feature").value);
  }
});



function checkDetailIndex() {
	for (let i = 0; i < fd_det_elmnt.children.length; i++) {
		if (i == det_index) {
			fd_det_elmnt.children[i].classList.add('bolden');
		}
		else {
			fd_det_elmnt.children[i].classList.remove('bolden');
		}
	}
	
	if (det_index == 0) {
		fd_det_content.innerHTML = '<p id="fd_synopsis" style="margin: unset;padding: unset;display: block;">' + details_data.data.synopsis + '</p>';
	}
	else if (det_index == 1) {
		fd_det_content.innerHTML = '<iframe src="' + details_data.data.trailer.embed_url + '&loop=true" style="position: relative;width: calc(712px - (16px * 2));height: 382px;"></iframe>';
	}
	else if (det_index == 2) {
		fd_det_content.innerHTML = '';
		
		loadingBar.setAttribute('style', 'width: 5%;opacity: 1.0;');
		
		// GET settings
		var details_settings = {
			"async": false,
			"crossDomain": true,
			"url": "https://api.jikan.moe/v4/anime/" + details_data.data.mal_id + "/characters",
			"method": "GET"
		};
		
		$.ajax(details_settings).done(function (json) {
			if (debug_mode.cde) {
				console.log(json);
			}
			var box = document.createElement('DIV');
			
			json.data.forEach(function(v, i) {
				var item = document.createElement('A');
				if (json.data[i].role == "Main") {item.classList.add('charMain');}
				item.classList.add('button');
				item.innerHTML = json.data[i].character.name + " (" + json.data[i].role + ")";
				item.setAttribute('href', json.data[i].character.url);
				
				box.append(item);
			});
			
			fd_det_content.append(box);
		});
		
		loadingBar.setAttribute('style', 'width: 100%;opacity: 1.0;');
		setTimeout(function() {
			loadingBar.setAttribute('style', 'width: 0%;opacity: 0.0;');
		}, 100);
	}
}

fd_det_elmnt.addEventListener('click', function(selected_element) {
	if (selected_element.path[0].name == "syn") {
		det_index = 0;
	}
	else if (selected_element.path[0].name == "trl") {
		det_index = 1;
	}
	else if (selected_element.path[0].name == "char") {
		det_index = 2;
	}
	checkDetailIndex();
});

// Custom Classes insert here
let debug = new Debug();
// end