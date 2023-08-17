var url = "http://192.168.0.50";
var script = "/filetree.php?path=";
var currentFilePath = "";
var imageViewer;
var current_tree;

document.addEventListener('DOMContentLoaded', function() {
	
	var urlParams = new URLSearchParams(window.location.search);
	currentFilePath = urlParams.get('param');

	var imageWrapper = document.getElementById('image_wrapper');
	imageViewer = document.createElement("img");
	imageViewer.src = url + currentFilePath;
	imageWrapper.appendChild(imageViewer);
});

document.addEventListener("keydown", function(event) {
	switch (event.keyCode) {
		case 37: //Arrow Left
			getNextImage(-1);
			break;
		case 39: //Arrow Right
			getNextImage(1);
			break;
		case 10009: //Back
			window.history.back();
			break;
	}
});

function getNextImage(i){
	var folders = currentFilePath.split('/');
	folders.pop();
	currentFolder = folders.join('/');
	getImageArray(currentFolder);
	const current_index = current_tree.findIndex(obj => obj.path === currentFilePath);
	if(current_index != -1){
		const newIndex = current_index + i;
		if(newIndex < 0 || newIndex >= current_tree.length){
			
		}else{
			updateImageViewer(current_tree[newIndex].path);
		}
	}
}


function updateImageViewer(path){
	imageViewer.src = url + path;
	currentFilePath = path;
}

function getImageArray(path){
	fetch(url + script + path)
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		current_tree = data.filter(obj => obj.mediaType === "image");
	})
	.catch(function(error) {
		current_tree = [];
		console.error(error);
	});
}