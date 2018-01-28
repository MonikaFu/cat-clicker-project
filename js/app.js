(function () {
    var model = {
    	init: function(nrCats) {
            localStorage.catData = JSON.stringify({
                cats: [],
               	currentCat: [],
               	nrCats: nrCats
            });
        },

        addCat: function(obj) {
            var data = JSON.parse(localStorage.catData);
            data.cats.push(obj);
            localStorage.catData = JSON.stringify(data);
        },

        updateCat: function(cat) {
        	var data = JSON.parse(localStorage.catData);
        	data.cats.splice(cat.id,1,cat);
        	localStorage.catData = JSON.stringify(data);
        },

        updateCurrentCat: function(id) {
        	var data = JSON.parse(localStorage.catData);
        	data.currentCat = id;
        	localStorage.catData=JSON.stringify(data);
        },

        getAllCatData: function() {
            return JSON.parse(localStorage.catData);
        }
    };

    var octopus = {
    	
    	addNewCat: function(name, url, picAuthor){
    		let allCats = octopus.getCatsArray();
    		if (allCats.length>0) {
	    		cat = {
	    			id: allCats[allCats.length-1].id+1,
	    			name: name,
	    			url: url,
	    			author: picAuthor,
	    			clicks: 0
	    		}
	    	} else {
	    		cat = {
	    			id: 0,
	    			name: name,
	    			url: url,
	    			author: picAuthor,
	    			clicks: 0
	    		}
	    	}
    		model.addCat(cat);
    	},

    	createCatObjects(nrImages,names) {
    		for (i=0;i<=nrImages-1;i++) {
    			octopus.addNewCat(names[i],'','')
    		}
    	},

    	addCatUrls: function(data) {
    		let allCats = octopus.getCatsArray();
    		let nrCats = octopus.getCatNr();

    		for (i=0;i<nrCats;i++) {
    			cat = allCats[i]; 
    			cat.url = data.results[i].urls.regular;
    			cat.author = data.results[i].user.name;

    			model.updateCat(cat);
    		};
    	},

    	fetchCatData: function(url,header) {
    		
    		let myInit = {
    			headers: header
    		}

    		function requestError(e, part) {
				console.log(e);
				viewClick.displayRequestError(part);
			};

    		fetch(url, myInit).then(response => response.json())
    		.then(octopus.addCatUrls)
			.then(viewList.render)
			.then(viewClick.render)
			.catch(e => requestError(e, 'image')); 

    	},

    	getCatNr: function() {
    		let data = model.getAllCatData();
    		return data.nrCats;
    	},

    	getCatsArray: function() {
    		let data = model.getAllCatData();
    		return data.cats;
    	},

    	getCurrentCat: function() {
    		let data = model.getAllCatData();
    		let currentCatId = data.currentCat
    		return data.cats[currentCatId];
    	},

    	setCurrentCat: function(id) {
    		model.updateCurrentCat(id);
    	},

    	increaseCurrentCatClicks: function() {
    		let currentCat = octopus.getCurrentCat();

    		currentCat.clicks+=1;
    		model.updateCat(currentCat);
    	},

    	updateCurrentCat:  function(name, url, author, clicks) {
    		let currentCat = octopus.getCurrentCat();
    		currentCat.name = name;
    		currentCat.url = url;
    		currentCat.author = author;
    		currentCat.clicks = Number(clicks);

    		model.updateCat(currentCat);
    		viewClick.render();
    		viewList.render();
    	},

    	init: function(url,header,nrImages,names) {
    		model.init(nrImages);
    		viewClick.init();
    		viewList.init(nrImages);
    		octopus.createCatObjects(nrImages, names);
    		octopus.setCurrentCat(0);
    		octopus.fetchCatData(url,header);
    	}
    };

    var viewClick = {
    	init: function() {
    		const viewClickDiv = $('.view-click');
    		let htmlContent = '';

    		htmlContent = htmlContent+`
				<p id="name-message">This is ${''}.</p>
				<p id="count-message">You've clicked on him ${0} times.</p>
				<figure>
					<img src="${''}" alt="Cat picture" id="cat-pic-click">
					<figcaption id="fig-caption">Cat picture by ${''}</figcaption>
				</figure>
				<button type="button" id="admin-button">Admin</button>
				<form id="admin-form">
					Cat's name:<br>
					<input type="text" name="cat-name"><br>
					Cat's url:<br>
					<input type="text" name="cat-url"><br>
					Author of the cat picture:<br>
					<input type="text" name="cat-pic-author"><br>
					Number of clicks:<br>
					<input type="text" name="clicks-number"><br>
					<input type="submit" value="Submit">
				</form>
				<button type="button" id="cancel-button">Cancel</button>
			</div>`

			viewClickDiv.html(htmlContent);

    		$('#cat-pic-click').click(function () {
				octopus.increaseCurrentCatClicks();

				let currentCat = octopus.getCurrentCat();
				
				$('#count-message').text(`You've clicked ${currentCat.clicks} times.`);
			});

    		$('#admin-button').click(function() {
    			$('#admin-form').css('visibility','visible')
    			$('#cancel-button').css('visibility','visible')
    		});

    		$('#cancel-button').click(function() {
    			$('#admin-form').css('visibility','hidden')
    			$('#cancel-button').css('visibility','hidden')
    		})

    		$('#admin-form').submit(function(event) {
    			let newName = $('input[name=cat-name]').val();
    			let newUrl = $('input[name=cat-url]').val();
    			let newAuthor = $('input[name=cat-pic-author]').val();
    			let newClicks = $('input[name=clicks-number]').val();

    			octopus.updateCurrentCat(newName, newUrl, newAuthor,newClicks);

    			$(':input','#admin-form')
 				.not(':button, :submit, :reset, :hidden')
 				.val('');
 				debugger;
 				$('#admin-form').css('visibility','hidden')
    			$('#cancel-button').css('visibility','hidden')

    			event.preventDefault();
    		})
    	},

    	render: function() {
    		const countMessage = $('#count-message');
    		const nameMessage = $('#name-message');
    		const catPic = $('#cat-pic-click');
    		let currentCat = octopus.getCurrentCat();
    		
    		nameMessage.html(`This is ${currentCat.name}.`);
    		countMessage.html(`You've clicked ${currentCat.clicks} times.`);
    		catPic.attr('src',currentCat.url);
    		$('#fig-caption').html(`Cat picture by ${currentCat.author}`)
    	},

    	displayRequestError: function(part) {
    		const viewClickDiv =  $('.view-click');
			viewClickDiv.html(`<p class="network-warning">Oh no! There was an error making the request for ${part}.</p>`);
    	}
    };

    var viewList = {
    	init: function(nrImages) {
    		const viewListDiv = $('.view-list');

    		let htmlContent = '<ul>';
	
			for (i=0;i<=nrImages-1;i++){
				//let image = data.results[i];
				htmlContent = htmlContent+`
					<li>
						<p id="name${i}"></p>
						<figure>
							<img src="${''}" alt="Cat picture" class="cat-pic-list" id="${i}">
						</figure>
					</li>`
			}
		
			htmlContent= htmlContent+`</ul>`
			viewListDiv.html(htmlContent);


    		$('.cat-pic-list').click(function () {
				octopus.setCurrentCat(Number(this.id));
				viewClick.render();
			});
    	},

    	render: function() {
    		let allCats = octopus.getCatsArray();
    		
    		allCats.forEach(function(cat) {
    			$(`#name${cat.id}`).html(cat.name);
    			$(`#${cat.id}`).attr('src',cat.url);
    		});
    	}

    };

    const nrImages = 5;
    const catNames = ['Fred', 'Jack','Bobby','Chad','Billy'];
    const url = 'https://api.unsplash.com/search/photos?page=1&query=kitten';
    const header = new Headers({
    	'Authorization': 'Client-ID 352564a5a889124ac39117a198b251cebe42d5d8f6e9015308a56ab3a1a32c01'
    });

    octopus.init(url,header,nrImages, catNames);       				

})();




