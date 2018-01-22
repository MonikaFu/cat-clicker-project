(function () {
    const imageContainer = document.querySelector('#image-container');
    let counter = 0;
    const countMessage = document.querySelector('#click-count-message')

    fetch('https://api.unsplash.com/search/photos?page=1&query=kitten', {
    headers: {
    	'Authorization': 'Client-ID 352564a5a889124ac39117a198b251cebe42d5d8f6e9015308a56ab3a1a32c01'
    }
	}).then(response => response.json())
	.then(addImage)
	.catch(e => requestError(e, 'image'));

	function addImage(data) {
		let htmlConent = '';

		const firstImage = data.results[0];

		if (firstImage) {
			htmlConent = `<figure>
				<img src="${firstImage.urls.regular}" alt="Cat picture">
				<figcaption>Cat picture by ${firstImage.user.name}</figcaption>
			</figure>`
		} else {
			htmlConent = 'Unfortunately, no image was returned for your search.'
		}

		imageContainer.insertAdjacentHTML('afterbegin',htmlConent);
	}

	function requestError(e, part) {
		console.log(e);
		imageContainer.insertAdjacentHTML('beforeend',`<p class="network-warning">Oh no! There was an error making the request for ${part}.</p>`);
	};

	function reportClickCount(nr) {
		let txt = `You've clicked ${nr} times.`;
		$('#click-count-message').text(txt);
	};

	imageContainer.addEventListener('click', function(){
	  counter+=1;
	  reportClickCount(counter);
	}, false);
})();
