var url = "http://192.168.0.50";
var script = "/filetree.php?path=";
var cloud_path = "/externalDrive/Cloud";
var current_path = cloud_path; //path of the current visible folder
var current_tree; //storing json file info objects
var id_Table = []; //index - visual grid index, value - current_tree index
var in_row = 5; //default
var lastTileFocus = 0; //to remember what tile was focused when moving from sidebar to grid
var lastSiderowFocus = 0; //to remember what siderow was focused when moving from grid to sidebar
var lastFileFocus = null;
var sidebarExtended = false;

window.onload = function () {
	var sessionPath = sessionStorage.getItem('current_path');
	if(sessionPath !== null){
		current_path = sessionPath;
	}
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
			renderGridContainer();
			hideLoading();
			updateThumbnails();
			
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
	var visiblePath = current_path.replace(cloud_path, "");
	var folders = visiblePath.split('/');
	var path = "/ " + folders.join("  >  ");
	var path_description = document.getElementById("path");
	path_description.innerHTML = path;
}

function renderGridContainer() {
	
	updatePathDescription();
	id_Table = [];
	
	var gridContainer = document.getElementById('grid-container');
  	gridContainer.innerHTML = ''; // Clear existing content
	var back_button_text = "Back";
  	if(current_path === cloud_path){back_button_text = "Exit";}
  	gridContainer.appendChild(generateTile('back', back_button_text));
	var index = 1;

	for (var i = 0; i < current_tree.length; i++) {
		var file = current_tree[i];
		if (file.type === 'directory') {
			id_Table[index] = i;
			index += 1;
			gridContainer.appendChild(generateTile(file.type, file.name));
		}
	}
	
	for (var i = 0; i < current_tree.length; i++) {
		var file = current_tree[i];
		if (file.type != 'directory') {
			id_Table[index] = i;
			index += 1;
			gridContainer.appendChild(generateTile(file.mediaType, file.name));
		}
	}
	setSidebarExtended(false);
	focusOnTile();	
}

function focusOnTile(){
	setTileFocused(0);
	var sessionFileFocus = sessionStorage.getItem('last_file_focused');
	if(sessionFileFocus !== null){ 
		focusTileByName(sessionFileFocus);
		sessionStorage.removeItem('last_file_focused');
		return;
	}
	if(lastFileFocus !== null){
		focusTileByName(lastFileFocus);
		lastFilefocus = null;
		return;
	}
}

function focusTileByName(fileName){
	for(var i = 1; i < id_Table.length; i++){
		if(current_tree[id_Table[i]].name === fileName){
			setTileFocused(i);
		}
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

function updateThumbnails(){
	var tiles = Array.from(document.getElementsByClassName("tile"));
	for (var i = 1; i < tiles.length; i++) {
		var file = current_tree[id_Table[i]];
		if (file.mediaType == 'video' || file.mediaType == 'image') {
			var thumbnail = tiles[i].querySelector('.thumbnail');
			setImageSourceIfValid(thumbnail, url + getThumbnailPath(file.path));
		}
	}
}

function setImageSourceIfValid(imgElement, imageUrl) {
	  var tempImage = new Image();
	  tempImage.onload = function() {
	    imgElement.src = imageUrl;
	  };
	  tempImage.src = imageUrl;
}

function getThumbnailPath(filePath) {
	  filePath = filePath.replace('Cloud', 'Thumbnails');
	  var indexOfDot = filePath.lastIndexOf('.');
	  if (indexOfDot !== -1) {
	    return filePath.substring(0, indexOfDot) + '.jpg';
	  }
	  return "";
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
			setSessionStorage(current_tree[tree_index].name);
			var nextPageUrl = '../video_player/player.html?param=' + encodeURIComponent(url + current_tree[tree_index].path);
			window.location.href = nextPageUrl;
		}else if(current_tree[tree_index].mediaType === 'image'){
			setSessionStorage(current_tree[tree_index].name);
			var nextPageUrl = '../image_viewer/viewer.html?param=' + encodeURIComponent(current_tree[tree_index].path);
			window.location.href = nextPageUrl;
		}
	}
}

function setSessionStorage(focus_file){
	sessionStorage.setItem('current_path', current_path);
	sessionStorage.setItem('last_file_focused', focus_file);
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
	if(current_path != cloud_path){
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
	lastFileFocus = folders.pop();
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