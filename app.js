// Some Variables
const search = document.querySelector('.searchInput'),
      searchBtn = document.querySelector('.searchBtn'),
      form = document.querySelector('#form'),
      main = document.querySelector('.main'),
      loadBtn = document.querySelector('#loadBtn'),
      loadBtnChild = document.querySelector('#loadBtnChild'),
      innermain = document.querySelector('#innerMain'),
      movieDetails = document.querySelector('.xxx'),
      api_url = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=5d5e916289a1e4966429ff0b018459f3',
      img_path = 'https://image.tmdb.org/t/p/w500',
      search_api = 'https://api.themoviedb.org/3/search/movie?api_key=5d5e916289a1e4966429ff0b018459f3&query=',
      allGenres = [
        {
           "id":28,
           "name":"Action"
        },
        {
           "id":12,
           "name":"Adventure"
        },
        {
           "id":16,
           "name":"Animation"
        },
        {
           "id":35,
           "name":"Comedy"
        },
        {
           "id":80,
           "name":"Crime"
        },
        {
           "id":99,
           "name":"Documentary"
        },
        {
           "id":18,
           "name":"Drama"
        },
        {
           "id":10751,
           "name":"Family"
        },
        {
           "id":14,
           "name":"Fantasy"
        },
        {
           "id":36,
           "name":"History"
        },
        {
           "id":27,
           "name":"Horror"
        },
        {
           "id":10402,
           "name":"Music"
        },
        {
           "id":9648,
           "name":"Mystery"
        },
        {
           "id":10749,
           "name":"Romance"
        },
        {
           "id":878,
           "name":"Science Fiction"
        },
        {
           "id":10770,
           "name":"TV Movie"
        },
        {
           "id":53,
           "name":"Thriller"
        },
        {
           "id":10752,
           "name":"War"
        },
        {
           "id":37,
           "name":"Western"
        }
      ];

// Get Some Popular Movies
const getMovies = (url) => {
  window.sessionStorage.setItem("ds", url[29]);
  fetch(url)
  .then((response) => {
    return response.json();
  })
  .then((myJson) => {
    window.sessionStorage.setItem("page", parseInt(myJson.page)+1);
    showMovies(myJson.results);
  });
}
getMovies(api_url);

// Show Movies
const showMovies = (movies) => {

  // Check whether Search_API or Discover_API
  if(window.sessionStorage.getItem("ds") === "s") {
    let searchPageNum = parseInt(window.sessionStorage.getItem("page"));
    if(searchPageNum === 2) {
      innermain.innerHTML = '';
      movieDetails.innerHTML = '';
      loadBtnChild.innerHTML = '';
    }
  }

  // Get Movie From Movies Array
  movies.forEach((movie) => {
    const youtubeUrl = "https://www.youtube.com/watch?v=";
    const trailerUrl = "https://api.themoviedb.org/3/movie/" + movie.id + "/videos?api_key=5d5e916289a1e4966429ff0b018459f3";
    
    // Get YouTube Trailer_Key
    function trailer(url) {
      fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((myJson) => {
        checking(myJson.results);
        window.sessionStorage.setItem(movie.id, checking(myJson.results));
      })
    }
    trailer(trailerUrl);

    // Check whether there is a Trailer_Key
    const checking = (x) => {
      if(x.length === 0) {
        if(movie.poster_path != null) {
          return "img/noVideo.jpg";
        } else {
          return "img/noVideo.jpg";
        }
      } else if(x.length === 1) {
          return youtubeUrl + x[0].key;
      } else {
          return youtubeUrl + x[x.length - 1].key;
      }       
    }
    // Create Modal Div
    const movieEl = document.createElement('div');
    const idx = "id" + movie.id;
    const details = document.createElement('div');
    details.className = "modal fade";
    details.setAttribute("aria-hidden", "true");
    details.id = idx;

    // Show IMDB Rate
    const showVote = (e) => {
      if(e.vote_average !== 0) {
        return e.vote_average;
      } else {
        return 'not voted yet';
      }
    }

    // Find movie genres by genre ids
    const showGenres =(x) => {
      let genres='';
      x.genre_ids.forEach((id) => {
        allGenres.forEach((i) => {
          if(id === i.id) {
            genres += `<h4 class="text-white">${i.name}</h4>`;
          }
        })
      });
      return genres;
    }

    // Backdrop Image
    const backImgUrl = (back) => {
      if(back != null) {
        return img_path + back;
      } else {
        return "img/youtubeBack.jpg";
      }
    }

    // Movie Image
    const fontImg = (font) => {
      if(font != null) {
        return img_path + font;
      } else {
        return "img/noImage.jpg";
      }
    }
  
    // Insert Card-info into DOM 
    movieEl.innerHTML += `
    <div class="card movie m-3 mb-4">
      <img class="card-img-top" src="${fontImg(movie.poster_path)}" alt="${movie.title}">
      <div class="card-img-overlay text-center pt-4">
        <h5 class="card-text fw-bold text-warning"><i class="fa fa-star" aria-hidden="true"></i><br>IMDB &nbsp${showVote(movie)}</h5>
        <div class= "genres">
        <h4 class="card-title pt-2">${showGenres(movie)}</h4>
        </div>
        <br>
      <div>
        <button id="${movie.id}" data-bs-toggle="modal" data-bs-target="#${idx}" class="details btn btn-success p-2 mt-2 fw-bold w-100"><h5>View Details</h5></button></div>
      </div>
      <div class="card-body p-1">
        <h5 class="card-title text-truncate text-light">${movie.title}</h5>
        <h6 class="card-subtitle text-muted fw-bold">${movie.release_date.slice(0, 4)}</h6>
      </div>
    </div>`
    innermain.appendChild(movieEl);

    // Insert Modal-info into DOM 
    details.innerHTML += `
    <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content text-light px-4">
      <div class="modal-header">
        <h4 class="modal-title" id="exampleModalLabel">${movie.title}</h4>
        <button type="button" class="btn-close bg-danger" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <h5 class="text-warning">Overview</h5>
          <p class="">${movie.overview}</p>
        </div>
        <div class="row">
          <h5 class="text-center fw-bold pt-3 pb-2">Watch the trailer on <span id=watchyoutube>YouTube</span></h5>
          <div class="youtube">
          <img  class="d-block mx-auto px-4 pb-2 w-75" src=${backImgUrl(movie.backdrop_path)} alt="">
          <a id="${movie.id}" class="ytbtn" target="_blank"><i class="fa fa-youtube-play fa-4x trailer"></i></a>
          </div>
        </div>
      </div>
    </div>
    </div>`
    movieDetails.appendChild(details);  
  });

  // Create a Load More Button
  loadBtnChild.innerHTML = `
  <button class="d-block btn btn-success mx-auto" id="loadMore">Load More
      </button>`;

  const loadMoreBtn = document.querySelector('#loadMore');
  loadMoreBtn.addEventListener('click', () => {
  let pageNum = parseInt(window.sessionStorage.getItem("page"));
  const pageKey = "&page=" + pageNum;
  let load_url;
  if(window.sessionStorage.getItem("ds") === "s") {
    let searchValueFromSession = window.sessionStorage.getItem("searchValue");
    load_url = search_api + searchValueFromSession +pageKey;
  } else {
    load_url = api_url + pageKey;
  }
  getMovies(load_url);
  pageNum += 1;
  window.sessionStorage.setItem("page", pageNum);
})

  // Listen to Event For YouTube Trailer
  let ytBtns = document.querySelectorAll('.ytbtn'); 
  let viewBtns = document.querySelectorAll('.details');
  viewBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      ytBtns.forEach((ytbtn) => {  
        if(btn.id === ytbtn.id) {
          let getsession = window.sessionStorage.getItem(btn.id);
          ytbtn.setAttribute("href", getsession);
        }
      });
    }); 
  });
}


// Listen to Event For Searching Movies
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  if(searchTerm && searchTerm !== '') {
    getMovies(search_api + searchTerm);
    window.sessionStorage.setItem("searchValue", searchTerm);
    search.value = '';
  } else {}
})



