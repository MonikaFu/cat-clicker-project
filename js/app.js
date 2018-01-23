(function () {
    const imageContainer = document.querySelector('#image-container');
    let counters = [0,0];
    const countMessage = document.querySelector('#click-count-message')
    const nrImages = 2;
    const catNames = ['Fred', 'Jack'];

    fetch('https://api.unsplash.com/search/photos?page=1&query=kitten', {
    headers: {
    	'Authorization': 'Client-ID 352564a5a889124ac39117a198b251cebe42d5d8f6e9015308a56ab3a1a32c01'
    }
	}).then(response => response.json())
	.then(addImage)
	.then(function(){
		$('.cat-pic').click(function (e) {
			picNr=Number($(this).id);
			console.log(picNr)
			$(this).counter+=1;
			$(this).siblings('.count-message').text(`You've clicked ${$(this).counter} times.`);
		});
	})
	.catch(e => requestError(e, 'image')); 

	function addImage(data) {
		let htmlContent = '';

		//const firstImage = data.results[0];

		if (data && data.results && data.results.length>nrImages) {
			for (i=0;i<=nrImages-1;i++){
				let image = data.results[i];
				htmlContent = htmlContent+`<div class="col-md-6">
					<p>This is ${catNames[i]}.</p>
					<p class="count-message">You've clicked on him ${counters[i]} times.</p>
					<figure>
						<img src="${image.urls.regular}" alt="Cat picture" class="cat-pic" id="${i}">
						<figcaption>Cat picture by ${image.user.name}</figcaption>
					</figure>
				</div>`
			}
		} else {
			htmlCotnent = 'Unfortunately, no image was returned for your search.'
		}

		imageContainer.insertAdjacentHTML('afterbegin',htmlContent);
	}

	function requestError(e, part) {
		console.log(e);
		imageContainer.insertAdjacentHTML('beforeend',`<p class="network-warning">Oh no! There was an error making the request for ${part}.</p>`);
	};
})();


