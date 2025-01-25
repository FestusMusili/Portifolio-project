const bars = document.querySelector(".bars");
const links = document.querySelector(".links");
const slider = document.querySelector(".slider");

bars.addEventListener("click", () => {
  links.classList.toggle("active");
  slider.classList.toggle("active");
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/getSliderImages"); // Replace with your server endpoint
    const data = await response.json();

    const swiperWrapper = document.getElementById("swiperWrapper");

    data.sliderImages.forEach((image) => {
      const slideDiv = document.createElement("div");
      slideDiv.classList.add("swiper-slide");

      const imgElement = document.createElement("img");
      imgElement.src = `${image.imagePath}`;

      slideDiv.appendChild(imgElement);
      swiperWrapper.appendChild(slideDiv);
    });

    // Initialize Swiper
    new Swiper(".swiper", {
      // Your Swiper options here
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  } catch (error) {
    console.error("Error fetching slider images:", error);
  }
});

//  quastion and answer area
const question = document.querySelectorAll(".quiz");
const add = document.querySelector(".plus1");
const add1 = document.querySelector(".plus2");
const add2 = document.querySelector(".plus3");

const detail = document.getElementById("quiz1");
const detail1 = document.getElementById("quiz2");
const detail2 = document.getElementById("quiz3");
const detail3 = document.getElementById("quiz4");

add.addEventListener("click", () => {
  detail.classList.toggle("active");
  add.classList.toggle("fa-times");
});
add1.addEventListener("click", () => {
  detail1.classList.toggle("active");
  add1.classList.toggle("fa-times");
});
add2.addEventListener("click", () => {
  detail2.classList.toggle("active");
  add2.classList.toggle("fa-times");
});

// search
// Add event listener to the search button
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("searchButton").addEventListener("click", searchCars);
  document
    .getElementById("searchForm")
    .addEventListener("submit", handleFormSubmit);
  document.body.addEventListener("click", clearSearchResults);
});

function searchCars() {
  console.log("clicked button");
  const search = document.getElementById("searchInput").value.toLowerCase();
  const additionalImageContainer = document.getElementById(
    "additionalImageContainer"
  );

  fetch("http://localhost:4001/cars")
    .then((response) => response.json())
    .then((cars) => {
      additionalImageContainer.innerHTML = ""; // Clear previous search results

      const filteredCars = cars.filter(
        (car) =>
          car.category.toLowerCase().includes(search) ||
          car.maker.toLowerCase().includes(search) ||
          car.year.toString().toLowerCase().includes(search) ||
          car.model.toLowerCase().includes(search) ||
          car.shape.toLowerCase().includes(search)
      );

      if (filteredCars.length > 0) {
        filteredCars.forEach((car, index) => {
          const listItem = document.createElement("div");
          listItem.classList.add("car-item");

          listItem.innerHTML = `
              <img src="${car.images[0]}" class="car-image">
              <h2>${car.maker} ${car.model}</h2>
              <p>Engine: ${car.engine}</p>
              <p>Price: ${car.price}</p>
              <p>Mileage: ${car.mileage}</p>
            `;
          additionalImageContainer.appendChild(listItem);

          listItem.addEventListener("click", () => {
            const mainImageContainer =
              document.getElementById("mainImageContainer");
            mainImageContainer.innerHTML = "";

            const mainImg = document.createElement("img");
            mainImg.src = `${car.images[0]}`;
            mainImg.classList.add("car-image");
            mainImageContainer.appendChild(mainImg);

            additionalImageContainer.innerHTML = "";

            car.images.forEach((image) => {
              const img = document.createElement("img");
              img.src = `${image}`;
              img.classList.add("additional-image");
              img.addEventListener("click", () => {
                mainImg.src = `${image}`;
              });
              additionalImageContainer.appendChild(img);
            });

            window.scrollTo({
              top: mainImageContainer.offsetTop,
              behavior: "smooth",
            });
          });
        });
      } else {
        additionalImageContainer.innerHTML = "<p>No cars found.</p>";
      }
      document.getElementById("searchInput").value = "";
    })
    .catch((error) => {
      console.error("Error fetching car data:", error);
    });
}

function handleFormSubmit(event) {
  event.preventDefault();
  searchCars();
}

