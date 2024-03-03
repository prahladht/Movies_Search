let movieDetailsEl = document.getElementById("movieDetails");

function createAndDisplayResult(result) {
    let { id = 'N/A', title = 'N/A', release_date = 'N/A', vote_average = 'N/A', popularity = 'N/A' } = result;

    let resultContainerEl = document.createElement("div");
    resultContainerEl.classList.add("result-item");
    movieDetailsEl.appendChild(resultContainerEl);

    // Fetch movie details including the poster
    fetchMovieDetails(id)
        .then(movie => {
            const posterPath = movie.poster_path;
            if (posterPath) {
                let posterEl = document.createElement("img");
                posterEl.classList.add("result-poster");
                posterEl.src = "https://image.tmdb.org/t/p/w500" + posterPath;
                posterEl.alt = title + " Poster";
                posterEl.addEventListener("click", function() {
                    window.open("https://image.tmdb.org/t/p/original" + posterPath);
                });
                resultContainerEl.appendChild(posterEl);
            } else {
                let noPosterEl = document.createElement("p");
                noPosterEl.textContent = "Poster not available";
                resultContainerEl.appendChild(noPosterEl);
            }
        })
        .catch(error => {
            console.error('Error fetching movie details:', error);
        });

    let titleEl = document.createElement("h1");
    titleEl.classList.add("result-title");
    titleEl.textContent = title;
    resultContainerEl.appendChild(titleEl);

    let idEl = document.createElement("p");
    idEl.classList.add("result-id");
    idEl.textContent = "ID: " + id;
    resultContainerEl.appendChild(idEl);

    let releaseEl = document.createElement("p");
    releaseEl.classList.add("result-release");
    releaseEl.textContent = "Release Date: " + release_date;
    resultContainerEl.appendChild(releaseEl);

    let voteEl = document.createElement("p");
    voteEl.classList.add("result-vote");
    voteEl.textContent = "IMDb Rating: " + vote_average;
    resultContainerEl.appendChild(voteEl);

    let popularityEl = document.createElement("p");
    popularityEl.classList.add("result-popularity");
    popularityEl.textContent = "Popularity: " + popularity;
    resultContainerEl.appendChild(popularityEl);

    // Fetch credits for the movie
    fetchMovieCredits(id)
        .then(credits => {
            // Extract director and top actors
            const director = credits.crew.find(member => member.job === 'Director');
            const actors = credits.cast.slice(0, 3).map(actor => actor.name); // Get top 3 actors and map their names

            // Display director and actors
            let directorEl = document.createElement("p");
            directorEl.classList.add("result-director");
            directorEl.textContent = "Director: " + (director ? director.name : 'N/A');
            resultContainerEl.appendChild(directorEl);

            let actorsEl = document.createElement("p");
            actorsEl.classList.add("result-actors");
            actorsEl.textContent = "Actors: " + actors.join(", ");
            resultContainerEl.appendChild(actorsEl);
        })
        .catch(error => {
            console.error('Error fetching credits:', error);
        });
}

async function fetchMovieCredits(movieId) {
    const apiKey = 'c6aac242fd5053d7709e338580942508';
    const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function fetchMovieDetails(movieId) {
    const apiKey = 'c6aac242fd5053d7709e338580942508';
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function displayResults(searchResults) {
    movieDetailsEl.innerHTML = ""; // Clear previous results
    for (let result of searchResults) {
        createAndDisplayResult(result);
    }
}

function searchMovie() {
    const movieName = document.getElementById('movieInput').value.trim();

    if (movieName === '') {
        alert('Please enter a movie name');
        return;
    }

    const apiKey = 'c6aac242fd5053d7709e338580942508';
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieName)}`;

    fetch(url)
        .then(response => response.json())
        .then(jsonData => {
            const movieResults = jsonData.results;
            displayResults(movieResults);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error retrieving movie information. Please try again.');
        });
}
