$('#spinner-modal').modal('show');

// Helper function used to extract the value of URL parameters
function getParameterByName (name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Helper function used to load supplementaryCSS
function loadCSS (css_url) {
	return $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', css_url));
}

// Helper function used to load supplementaryScripts
function loadScript (script_url) {
    return $.getScript(script_url);
}

// Function that displays the contents of a specific blog post if the "p" URL parameter matches an particular post stored in your Firebase DB 
function dataSuccess (blogData) {

	document.title = blogData.htmlTitle;
	$('meta[name="description"]').attr("content", blogData.metaDescription);

	$('#link-linkedin').attr('href', encodeURI('https://www.linkedin.com/shareArticle?mini=true&url=' + window.location.href + '&title=' + blogData.title + '&summary=' + blogData.metaDescription + '&source=' + 'yourblog.com'));
	$('#link-facebook').attr('href', encodeURI('https://www.facebook.com/sharer/sharer.php?u=' + window.location.href + '&title=' + blogData.title + '&description=' + blogData.metaDescription));
	$('#link-twitter').attr('href', encodeURI('https://twitter.com/intent/tweet?url=' + window.location.href));

	$('.header').css('background', 'url(' + blogData.imageURL + ')  no-repeat center center scroll');
	$('.header').css('background-size', 'cover');

	$('#post-title').text(blogData.title);
	$('#post-subtitle').text(blogData.subtitle);
	var months = ['Jan.','Feb.','Mar.','Apr.','May','June','July','Aug.','Sept.','Oct.','Nov.','Dec.'];
	var postDate = new Date(blogData.timestamp);
	$('#post-author').html("By: " + blogData.author + ' &#8226; ' + months[postDate.getMonth()] + ' ' + postDate.getDate() + ', ' + postDate.getFullYear());

	$('#blog-content').html(blogData.content);

	// Load additional CSS if necessary
	if (blogData.supplementaryCSS != '') {

		var CSSString = blogData.supplementaryCSS;
		var css = CSSString.split(',');

		var tempForSyncCSS;

		for (var i = 0; i < css.length; i++) {
			tempForSyncCSS = loadCSS(css[i]);
		}
	}

	// Load additional JS if necessary
	if (blogData.supplementaryScripts != '') {

		var scriptString = blogData.supplementaryScripts;
		var scripts = scriptString.split(',');
		var tempForSync;

		for (var i = 0; i < scripts.length; i++) {
			tempForSync = loadScript(scripts[i]);
		}
	}
}

// Default function that displays a list of all blog posts if the "p" URL parameter is not specified or does not match any particular post stored in your Firebase DB - this determines the contents of your blog home page
function displayAllPosts (snapshot) {

	$('#link-linkedin').attr('href', encodeURI('https://www.linkedin.com/shareArticle?mini=true&url=' + window.location.href + '&title=' + 'Blog Home Page Name' + '&summary=' + 'Blog Home Page Subtitle' + '&source=' + 'yourblog.com'));
	$('#link-facebook').attr('href', encodeURI('https://www.facebook.com/sharer/sharer.php?u=' + window.location.href + '&title=' + 'Blog Home Page Name' + '&description=' + 'Blog Home Page Subtitle'));
	$('#link-twitter').attr('href', encodeURI('https://twitter.com/intent/tweet?url=' + window.location.href));

	var postObjects = [];

			
	snapshot.forEach(function(childSnapshot) {
		var postObj = childSnapshot.val();
		postObj.key = childSnapshot.key;
		postObjects.push(postObj);
	});

	// Put latest posts first
	postObjects.sort(function(a, b) {
		return b.timestamp - a.timestamp;
	});

	var blogPosts = '<div class="row">';

	for (var i = 0; i < postObjects.length; i++) {
		blogPosts += '<div class="col-lg-4 col-md-6 col-sm-6 col-xs-12" style="margin:0 auto;"><div class="card"><a href="' + '/yourblogdirectory?p=' + postObjects[i].key + '"><img src="' + postObjects[i].imageURL + '" class="image-cover"><div class="card-container"><h4 class="text-center"><b>' + postObjects[i].title + '</b></h4><p>' + postObjects[i].metaDescription + '</p></div></a></div></div>';
	}				

	blogPosts += '</div>';

	$('.header').css('background', 'url(' + 'img/header.jpg' + ')  no-repeat center center scroll');
	$('.header').css('background-size', 'cover');
	$('#blog-content').html(blogPosts);

}

function handleSuccess (data) {
	console.log('Success.');
	$('#spinner-modal').modal('hide');
}

function handleError (data) {
	console.log('Error retrieving data from Firebase DB.');
	$('#spinner-modal').modal('hide');
}

// Get blog content
var database = firebase.database();

var postURLParam = getParameterByName('p');

database.ref('/blog/posts/').once('value', function(snapshot) {

	if ((postURLParam != null) && (postURLParam != '') && (snapshot.hasChild(postURLParam))) {
		console.log('Post exists.');
		dataSuccess(snapshot.child(postURLParam).val());
    }
    else {
    	console.log('Post does not exist.');
    	displayAllPosts(snapshot);
    }
	
}).then(handleSuccess, handleError);