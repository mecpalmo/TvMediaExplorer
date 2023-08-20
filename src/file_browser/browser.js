var url = "http://192.168.0.50";
var script = "/filetree.php?path=";
var current_path = "";

var current_tree;
var id_Table = [];

var in_row = 5;
var sidebarExtended = false;
var lastTileFocus = 0;
var lastSiderowFocus = 0;

var sessionPath = sessionStorage.getItem('current_path');
if(sessionPath !== null){ current_path = sessionPath; }

window.onload = function () {
	setSidebarExtended(false);
	updateGridView();
}

function updateGridView() {
	showLoading();
	fetch(url + script + current_path)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			current_tree = data;
			renderGridContainer(data);
			hideLoading();
		})
		.catch(function(error) {
			current_tree = [];
			renderErrorMessage(error);
			setTileFocused(0);
			hideLoading();
		});
	
}

function renderErrorMessage(error){
	var path_description = document.getElementById("path");
	path_description.innerHTML = "Błąd połączenia. " + error;
}

function updatePathDescription(){
	var folders = current_path.split('/');
	var path = "/ " + folders.join("  >  ");
	var path_description = document.getElementById("path");
	path_description.innerHTML = path;
}

function renderGridContainer(fileTree) {

	updatePathDescription();
	
	var gridContainer = document.getElementById('grid-container');
  	gridContainer.innerHTML = ''; // Clear existing content
	var back_button_text = "Back";
  	if(current_path === ""){back_button_text = "Exit";}
  	gridContainer.appendChild(generateTile('back', back_button_text));
	var index = 1;

	for (var i = 0; i < fileTree.length; i++) {
		var file = fileTree[i];
		if (file.type === 'directory') {
			id_Table[index] = i;
			index += 1;
			gridContainer.appendChild(generateTile(file.type, file.name));
		}
	}
	
	for (var i = 0; i < fileTree.length; i++) {
		var file = fileTree[i];
		if (file.type != 'directory') {
			id_Table[index] = i;
			index += 1;
			gridContainer.appendChild(generateTile(file.mediaType, file.name));
		}
	}
	
	setSidebarExtended(false);
	setTileFocused(0);
	var sessionFocus = sessionStorage.getItem('last_focus');
	if(sessionFocus !== null){ 
		setTileFocused(sessionFocus);
		sessionStorage.setItem('last_focus', null);
	}
		
}

function generateTile(type, name){
	var tile = document.createElement('div');
	tile.classList.add('tile');
	tile.setAttribute('tabindex', '-1');
	var thumbnail = document.createElement('img');
	thumbnail.classList.add('thumbnail');
	thumbnail.src = getFileIconPath(type);
	var title = document.createElement('div');
	title.classList.add('title');
	title.textContent = setTitle(name);
	tile.appendChild(thumbnail);
	tile.appendChild(title);
	return tile;
}

function setTitle(text){ //the title needs to be shortened bc too long can destroy the grid
	maxLength = 30;
	if (text.length <= maxLength) {
	    return text;
	}
	const truncatedText = text.slice(0, maxLength / 2 - 2) + '...' + text.slice(text.length - maxLength / 2 + 1);
	return truncatedText;
}

function getFileIconPath(type){
	const icons_path = '../../icons/';
	switch(type){
		case 'directory':
			return icons_path + 'folder.png';
		case 'video':
			return icons_path + 'video.png';
		case 'image':
			return icons_path + 'image.png';
		case 'back':
			return icons_path + 'back.png';
		default:
			return icons_path + 'file.png';
	}
}

function enterTile(index) {
	if(index === 0){
		pressedBack();
	}else{
		tree_index = id_Table[index];
		if (current_tree[tree_index].type === 'directory'){
			current_path = current_tree[tree_index].path;
			updateGridView();
		}else if(current_tree[tree_index].mediaType === 'video'){
			setSessionStorage(index);
			var nextPageUrl = '../video_player/player.html?param=' + encodeURIComponent(url + current_tree[tree_index].path);
			window.location.href = nextPageUrl;
		}else if(current_tree[tree_index].mediaType === 'image'){
			setSessionStorage(index);
			var nextPageUrl = '../image_viewer/viewer.html?param=' + encodeURIComponent(current_tree[tree_index].path);
			window.location.href = nextPageUrl;
		}
	}
}

function setSessionStorage(focus_index){
	sessionStorage.setItem('current_path', current_path);
	sessionStorage.setItem('last_focus', focus_index);
}

function enterSiderow(siderow){
	switch(siderow.id){
		case "home":
			current_path = "";
			updateGridView();
			break;
		case "refresh":
			updateGridView();
			break;
		case "search":
			break;
		case "filter":
			break;
		case "sort":
			break;
	}
}

function pressedBack(){
	if(current_path.indexOf("/") !== -1){
		backFromFolder();
	}else{
		try {
			tizen.application.getCurrentApplication().exit();
		} catch (error) {
			console.error('Error: ' + error.message);
		}
	}
}

function backFromFolder() {
	var folders = current_path.split('/');
	folders.pop();
	current_path = folders.join('/');
	updateGridView();
}

function setSidebarExtended(focused){
	const sidebar = document.getElementById("sidebar");
	var siderows = Array.from(document.getElementsByClassName("siderow"));
	sidebarExtended = focused;
	var sidebarDiv = document.getElementById("sidebar");
	if(focused){
		for (var i = 0; i < siderows.length; i++) {
			var row = siderows[i];
			var sidetextDiv = row.querySelector('.sideText');
			if (sidetextDiv && sidetextDiv.classList.contains('hidden')){
				sidetextDiv.classList.remove('hidden');
			}
		}
		if(sidebarDiv){
			sidebar.classList.add('extended');
		}
	}else{
		if(sidebarDiv && sidebarDiv.classList.contains('extended')){
			sidebar.classList.remove('extended');
		}
		for (var i = 0; i < siderows.length; i++) {
			var row = siderows[i];
			var sidetextDiv = row.querySelector('.sideText');
			if (sidetextDiv){
				sidetextDiv.classList.add('hidden');
			}
		}
	}
}

function setTileFocused(index){
	const tiles = Array.from(document.getElementsByClassName("tile"));
	if(tiles[index]) {
		tiles[index].focus();
		lastTileFocus = index;
	}
	if(index >= tiles.length){
		lastTileFocus = tiles.length - 1;
		tiles[lastTileFocus].focus();
	}
}


function setSiderowFocused(index){
	const siderows = Array.from(document.getElementsByClassName("siderow"));
	if(siderows[index]) {
		siderows[index].focus();
		lastSiderowFocus = index;
	}
}

function showLoading(){
	const loader = document.getElementById("loader");
	loader.style.display = "block";
}

function hideLoading(){
	const loader = document.getElementById("loader");
	loader.style.display = "none";
}

document.addEventListener("keydown", function(event) { //button handler
    
	const currentFocusedItem = document.activeElement;

	if (currentFocusedItem.classList.contains("tile") || currentFocusedItem.classList.contains("siderow")) {
      
		const tiles = Array.from(document.getElementsByClassName("tile"));
		const tileIndex = tiles.indexOf(currentFocusedItem);

		const siderows = Array.from(document.getElementsByClassName("siderow"));
		const siderowIndex = siderows.indexOf(currentFocusedItem);
	
		switch (event.keyCode) {
			case 38: //Arrow Up
				if(sidebarExtended){
					setSiderowFocused(Math.max(siderowIndex - 1, 0));
				}else {
					setTileFocused(tileIndex - in_row);
					setSidebarExtended(false);
				}
				break;
			case 40: //Arrow Down
				if(sidebarExtended){
					setSiderowFocused(Math.min(siderowIndex + 1, siderows.length - 1));
				}else {
					setTileFocused(tileIndex + in_row);
					setSidebarExtended(false);
				}
				break;
			case 37: //Arrow Left
				if(!sidebarExtended) {
					if(tileIndex % in_row === 0){
						lastTileFocus = tileIndex;
						setSidebarExtended(true);
						setSiderowFocused(lastSiderowFocus);
					}else {
						setTileFocused(tileIndex - 1);
						setSidebarExtended(false);
					}
				}
				break;
			case 39: //Arrow Right
				if(sidebarExtended){
					setSidebarExtended(false);
					lastSiderowFocus = siderowIndex;	
					setTileFocused(lastTileFocus);
				}else {
					setSidebarExtended(false);
					setTileFocused(tileIndex + 1);
				}
				break;
			case 13: //Enter
				if(sidebarExtended){
					enterSiderow(siderows[siderowIndex]);
				}else {
					enterTile(tileIndex);
				}
				break;
			case 10009: //Back
				if(sidebarExtended){
					lastSiderowFocus = siderowIndex;
					setSidebarExtended(false);
				}else {
					pressedBack();
				}
				break;
			default:
				break;
    	}

    }else {
    	setTileFocused(0);
    	setSidebarExtended(false);
    }
});