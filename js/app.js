(function () {
    const imageContainer = document.querySelector('#image-container');
    let counters = [0,0,0,0,0];
    const countMessage = document.querySelector('#click-count-message')
    const nrImages = 5;
    const catNames = ['Fred', 'Jack','Bobby','Chad','Billy'];
    let picNr; 

    fetch('https://api.unsplash.com/search/photos?page=1&query=kitten', {
    headers: {
    	'Authorization': 'Client-ID 352564a5a889124ac39117a198b251cebe42d5d8f6e9015308a56ab3a1a32c01'
    }
	}).then(response => response.json())
	.then(addImage)
	.then(function(){
		$('#cat-pic-click').click(function (e) {
			counters[picNr]+=1;
			$(this).parent().siblings('.count-message').text(`You've clicked ${ counters[picNr]} times.`);
		});

		$('.cat-pic-list').click(function (e) {
			picNr=Number(this.id);
			$('#cat-pic-click').parent().siblings('.count-message').text(`You've clicked ${ counters[picNr]} times.`);
			$('#cat-pic-click').parent().siblings('.name-message').text(`This is ${catNames[picNr]}.`);
			$('#cat-pic-click').attr('src',$(this).attr('src'));
		});
	})
	.catch(e => requestError(e, 'image')); 

	function addImage(data) {
		let htmlContent = '';

		if (data && data.results && data.results.length>nrImages) {
			const firstImage = data.results[0];
			htmlContent = htmlContent+`<div class="col-md-9">
				<p class="name-message">This is ${catNames[0]}.</p>
				<p class="count-message">You've clicked on him ${counters[0]} times.</p>
				<figure>
					<img src="${firstImage.urls.regular}" alt="Cat picture" id="cat-pic-click">
					<figcaption>Cat picture by ${firstImage.user.name}</figcaption>
				</figure>
			</div>
			<div class="col-md-3">
       				<ul>`
	
			for (i=0;i<=nrImages-1;i++){
				let image = data.results[i];
				htmlContent = htmlContent+`
					<li><figure>
						<img src="${image.urls.regular}" alt="Cat picture" class="cat-pic-list" id="${i}">
						<figcaption>Cat picture by ${image.user.name}</figcaption>
					</figure></li>`
			}
			} else {
				htmlCotnent = 'Unfortunately, no image was returned for your search.'
			}
		
		htmlContent= htmlContent+`</ul></div>`
		imageContainer.insertAdjacentHTML('afterbegin',htmlContent);
	}

	function requestError(e, part) {
		console.log(e);
		imageContainer.insertAdjacentHTML('beforeend',`<p class="network-warning">Oh no! There was an error making the request for ${part}.</p>`);
	};
})();




