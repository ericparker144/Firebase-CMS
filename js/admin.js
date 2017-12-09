function getParameterByName (name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var postURLParam = getParameterByName('p');

function dataSuccess (data) {
	console.log(data.val());
}

function dataError (data) {
	console.log(data.val());
}

// Return true if the input is bad
function validateInput (inputID, inputVal, badVal) {
	if (inputVal == badVal) {
		$('#' + inputID).addClass('alert');
		$('#' + inputID).addClass('alert-danger');
		return true;
	}
	return false;
}

function postArticle (email, password, title, subtitle, author, content, url, imageURL, supplementaryScripts, supplementaryCSS, htmlTitle, metaDescription) {

  	firebase.auth().signInWithEmailAndPassword(email, password).then(function () {

  		var post = firebase.database().ref('/blog/posts/' + url);

  		post.once('value', function(snapshot) {

  			if ((snapshot.val() === null) || ((snapshot.val() !== null) && (postURLParam === url))) {
  				// New Post || Update Post
  				post.set({
	  		  		title: title,
	  		  		subtitle: subtitle,
	  		  		author: author,
	  				content: content,
	  				imageURL: imageURL,
	  				supplementaryScripts: supplementaryScripts,
	  				supplementaryCSS: supplementaryCSS,
	  				htmlTitle: htmlTitle,
	  				metaDescription: metaDescription,
	  				timestamp: +Date.now()
	  			}).then(function (event) {

	  				// Reload the admin page when post is created/updated successfully
	  				window.location.href = 'admin.html';

	  			}).catch(function(error) {

	  				console.log('Error writing to DB.');
	  				$('#content').after('<div id="error-message" class="alert alert-danger"><b>Error: </b>' + error.code + ' - ' + error.message + '</div>');

	  			});
  			}
  			else {
  				console.log('Post already exists.');
  				$('#content').after('<div id="error-message" class="alert alert-danger"><b>Error: </b>' + 'Post with path "' + url + '" already exists. If you want to update that post, <a href="' + window.location.protocol + '//' + window.location.host + window.location.pathname + '?p=' + url + '">go here</a>. Otherwise, change the value of URL Path input to create a new post.' + '</div>');
  			}
  		});


  	}).catch(function(error) {

  		console.log('Auth Error.');
  		$('#content').after('<div id="error-message" class="alert alert-danger"><b>Error: </b>' + error.code + ' - ' + error.message + '</div>');

	});
}


$('#page-title').keyup(function () {

	$('#url').val($('#page-title').val().replace(/\W+/g, '-').toLowerCase());
});

$('#blogpost').submit(function (event) {


	$('#error-message').remove();
	$('#blogpost input, #blogpost textarea').each(function () {
		$(this).removeClass('alert-danger');
	});

	var email = $('#email').val();
	var password = $('#password').val();
	var title = $('#title').val();
	var subtitle = $('#subtitle').val();
	var author = $('#author').val();
	var content = $('#content').val();
	var url = encodeURI($('#url').val());
	var imageURL = $('#image-url').val();
	var htmlTitle = $('#page-title').val();
	var metaDescription = $('#meta-description').val();
	var supplementaryScripts = $('#supplementary-scripts').val();
	var supplementaryCSS = $('#supplementary-css').val();

	var isBad = false;

	var inputsQuality = [];

	$('#blogpost input, #blogpost textarea').each(function () {
		if (!(($(this).attr('id') == 'supplementary-scripts') || ($(this).attr('id') == 'supplementary-css'))) {
			inputsQuality.push(validateInput($(this).attr('id'), $('#' + $(this).attr('id')).val(), ''));
		}
	});

	for (var i = 0; i < inputsQuality.length; i++) {
		isBad = isBad || inputsQuality[i];
	}

	if (isBad) {

		$('#content').after('<div id="error-message" class="alert alert-danger"><b>Error.</b> All highlighted fields are required.</div>');

	}
	else {
		postArticle(email, password, title, subtitle, author, content, url, imageURL, supplementaryScripts, supplementaryCSS, htmlTitle, metaDescription);
	}

	return false;
});

var database = firebase.database();

database.ref('/blog/posts/').once('value', function(snapshot) {

	if ((postURLParam != null) && (postURLParam != '') && (snapshot.hasChild(postURLParam))) {

		// If a post is specified, prepare for editing
		console.log('Post exists.');
		var postContent = snapshot.child(postURLParam).val();

		$('#title').val(postContent.title);
		$('#subtitle').val(postContent.subtitle);
		$('#author').val(postContent.author);
		$('#content').val(postContent.content);
		$('#url').val(postURLParam);
		$('#image-url').val(postContent.imageURL);
		$('#page-title').val(postContent.htmlTitle);
		$('#meta-description').val(postContent.metaDescription);
		$('#supplementary-scripts').val(postContent.supplementaryScripts);
		$('#supplementary-css').val(postContent.supplementaryCSS);

	}
});