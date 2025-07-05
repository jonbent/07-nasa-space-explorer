// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)

const spaceFacts = [
  "Venus rotates backwards. The Sun rises in the west and sets in the east.",
  "Neutron stars can spin 600 times per second.",
  "A day on Venus is longer than its year. (243 Earth days vs. 225 Earth days)",
  "There’s floating water in space. A cloud of water vapor in the constellation Aquarius holds 140 trillion times Earth's water supply.",
  "The Moon is slowly drifting away from Earth at about 3.8 cm per year.",
  "You can’t burp in space—no gravity means gas can’t separate from liquids in your stomach.",
  "Saturn’s moon Titan has lakes and rivers—but they’re made of liquid methane and ethane.",
  "One spoonful of a neutron star would weigh a billion tons.",
  "There’s a planet made of diamonds. It’s called 55 Cancri e.",
  "Jupiter’s Great Red Spot is a giant storm that’s been raging for at least 350 years.",
  "The largest volcano in the solar system is Olympus Mons on Mars—almost 3x the height of Mount Everest.",
  "The International Space Station orbits Earth every 90 minutes.",
  "Space is not completely silent. There are electromagnetic vibrations that can be translated into sound.",
  "There’s a massive cold spot in the universe that might be caused by a supervoid.",
  "Mercury has almost no atmosphere, which means it can’t retain heat—its temperature swings by over 1,000°F in a day.",
  "Uranus spins on its side. Scientists think it was knocked over by a huge collision.",
  "A day on Neptune is only about 16 hours long.",
  "The Sun makes up 99.86% of the mass of the entire solar system.",
  "Black holes can slow down time. Time near a black hole moves slower than farther away.",
  "There’s a “space tsunami” called a coronal mass ejection, where the Sun hurls billions of tons of plasma into space.",
  "Pluto has 5 moons. The largest is Charon, which is so big they actually orbit each other.",
  "Earth's magnetic field protects us from solar radiation, which would otherwise strip away the atmosphere.",
  "Saturn is less dense than water. If you could fit it in a big enough pool, it would float.",
  "Mars has blue sunsets. The fine dust scatters sunlight in a way that makes the sunsets appear blue to the human eye.",
  "There’s a galaxy shaped like a sombrero. It’s called the Sombrero Galaxy (M104).",
  "Astronauts grow taller in space—up to 2 inches—because the spine isn’t compressed by gravity.",
  "There’s a planet where it rains glass sideways. HD 189733b has 5,000 mph winds and silicate clouds.",
  "The largest known star is UY Scuti, which is about 1,700 times the diameter of the Sun.",
  "Light from the Sun takes 8 minutes and 20 seconds to reach Earth.",
  "There are more stars in the universe than grains of sand on Earth."
];

// uses a self-deployed node application to hide the api key,
// when provided a key by "api.data.gov" we are told:
// "This API key is for your use and should not be shared."
// in my opinion, this should not be pushed to a github repo, where it can be scraped.
// the code for the server can be found at: https://github.com/jonbent/nasa-api-server
const endpoint = "https://45dsyb925g.execute-api.us-west-1.amazonaws.com/dev/planetary/apod"

const startNasaResponse = async () => {
        const galleryContainer = document.getElementById('gallery');
        toggleLoading();
        try {
            const nasaResponse = await fetch(`${endpoint}?startDate=${startInput.value}&endDate=${endInput.value}`, {mode: 'cors'});
            galleryContainer.innerHTML = "";
            galleryContainer.classList.add("row");

            const nasaData = await nasaResponse.json();

            nasaData.forEach((item) => {
                createPhotoCard(galleryContainer, item)
            })

            toggleLoading();
        } catch (error) {
            console.log(error);
            alert("failed to fetch data from NASA's API. Try a smaller date range")
            galleryContainer.innerHTML = `<div class="placeholder-nb">
                <div class="placeholder-icon-nb">🔭</div>
                    <p>Select a date range and click "Get Space Images" to explore the cosmos!</p>
              </div>`;
            toggleLoading();
        }
}

const toggleLoading = () => {
    document.getElementById('loading-container').classList.toggle('d-none');
}

const createPhotoCard = (containerElement, data) => {
    if (!data.url)return;
    const newEl = document.createElement("div");
    newEl.classList.add("card");
    newEl.classList.add("col-md-5");
    newEl.innerHTML = `
        <div class="card-body" data-bs-toggle="modal" data-bs-target="#info-modal" >
            ${data.url.includes("youtube.com") ? `<div class="ratio ratio-16x9 img-fluid">
              <iframe 
                src="${data.url}" 
                title="${data.title}" 
                allowfullscreen>
              </iframe>
            </div>` : 
        `<img src="${data.url}" loading="lazy" class="card-img-top rounded img-fluid" alt="${data.title}">`}
            <h5 class="card-title">${data.title}</h5>
            <h6 class="card-subtitle mb-2">${new Date(data.date).toDateString()}</h6>
        </div>
    `;
    const modal = document.getElementById("info-modal");
    newEl.addEventListener('click', () => {
        modal.querySelector(".modal-title").innerText = data.title;
        modal.querySelector(".modal-body").innerHTML = `${data.url.includes("youtube.com") ? `<div class="ratio ratio-16x9 img-fluid">
              <iframe 
                src="${data.url}" 
                title="${data.title}" 
                allowfullscreen>
              </iframe>
            </div>` : 
        `<img src="${data.url}" loading="lazy" class="card-img-top rounded img-fluid" alt="${data.title}">`}
        </br>
        <b>${new Date(data.date).toDateString()}</b>
        </br>
        ${data.explanation}
        `
    })
    containerElement.appendChild(newEl);
    return newEl;
}

document.getElementById("fetch-button").addEventListener('click', async () => {
    await startNasaResponse();
})
let interval;
const showSpaceFact = () => {
    clearInterval(interval);
    const fact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
    document.getElementById("random-space-fact-container").classList.remove("d-none");
    document.getElementById("random-space-fact").innerText = fact;
    interval = setInterval(showSpaceFact, 10000)
}

document.addEventListener('DOMContentLoaded', async (event) => {
    setupDateInputs(startInput, endInput);
    await startNasaResponse();
    document.getElementById("close-modal").addEventListener('click', () => {
        document.querySelector(".modal-body").innerHTML = "";
    })
    showSpaceFact()
})
