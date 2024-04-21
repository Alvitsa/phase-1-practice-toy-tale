document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  let addToy = false; // Variable to track whether the form is visible or not

  // Event listener to toggle visibility of the toy form container
  addBtn.addEventListener("click", () => {
      // Toggle the value of addToy
      addToy = !addToy;
      // Update the display property of toyFormContainer accordingly
      toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch Andy's Toys and render them
  fetchToys();

  // Add event listener for the form submission to add a new toy
  const form = document.querySelector('.add-toy-form');
  form.addEventListener('submit', (event) => {
      event.preventDefault();
      addNewToy(event.target);
  });

  // Add event listener for the like buttons
  document.addEventListener('click', (event) => {
      if (event.target.classList.contains('like-btn')) {
          const toyId = event.target.id;
          increaseLikes(toyId);
      }
  });
});

function fetchToys() {
  fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(toys => {
          toys.forEach(toy => renderToy(toy));
      });
}

function renderToy(toy) {
  // Create toy card
  const card = document.createElement('div');
  card.classList.add('card');

  // Add toy info to the card
  card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  // Append card to the toy collection
  document.getElementById('toy-collection').appendChild(card);
}

function addNewToy(form) {
  const toyData = {
      name: form.name.value,
      image: form.image.value,
      likes: 0
  };

  fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      body: JSON.stringify(toyData)
  })
  .then(response => response.json())
  .then(newToy => renderToy(newToy));
}

function increaseLikes(toyId) {
  const toyCard = document.getElementById(toyId);
  const currentLikes = parseInt(toyCard.previousElementSibling.innerText);
  const newLikes = currentLikes + 1;

  fetch(`http://localhost:3000/toys/${toyId}`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      body: JSON.stringify({ likes: newLikes })
  })
  .then(response => response.json())
  .then(updatedToy => {
      // Update the likes in the DOM
      toyCard.previousElementSibling.innerText = `${updatedToy.likes} Likes`;
  });
}