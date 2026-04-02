// Wait for page load
document.addEventListener('DOMContentLoaded', function () {
  console.log('JS loaded!'); // Debug check

  // Find elements SAFELY
  const menuToggle = document.querySelector('.hamburger-symbol');
  const nav = document.querySelector('.primary-nav');

  // Check if elements exist
  // if (!menuToggle || !nav) {
  //   console.error('Missing elements:', { menuToggle, nav });
  //   return;
  // }

  // console.log('Elements found:', menuToggle, nav);

  // Toggle menu
  menuToggle.addEventListener('click', function () {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

    menuToggle.setAttribute('aria-expanded', !isOpen);
    nav.classList.toggle('nav-hidden');
    nav.classList.toggle('nav-visible');

    console.log('Menu toggled:', !isOpen); // Debug
  });

  // Close on nav link click
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach((link) => {
    link.addEventListener('click', function () {
      menuToggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('menu-open');
      console.log('Link clicked, menu closed');
    });
  });
});

// Smooth scroll to recipe
function scrollToRecipe() {
  const select = document.getElementById('recipe-select');
  const target = document.querySelector(select.value);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Back to top
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show/hide back-to-top button
window.addEventListener('scroll', () => {
  const btn = document.getElementById('back-to-top');
  if (btn) {
    btn.style.display = window.scrollY > 300 ? 'block' : 'none';
  }
});

// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js';
// Import the Cloud Firestore SDK
import {
  getFirestore,
  collection,
  addDoc,
} from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js'; //

console.log('main.js loaded');

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyD1uLnxh4Wha0F7iIurT0qZbSjZirOBta8',
  authDomain: 'munch-sprouts.firebaseapp.com',
  projectId: 'munch-sprouts',
  storageBucket: 'munch-sprouts.firebasestorage.app',
  messagingSenderId: '196046068030',
  appId: '1:196046068030:web:433281ab897493b7cdf46f',
  measurementId: 'G-XCNG43SG0J',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Now you can use 'db' to interact with your Firestore database.
// For example, to add a new document to a collection called 'users':
async function saveUserData(name, email) {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      name: name,
      email: email,
      timestamp: new Date(),
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

async function testFirebase() {
  try {
    const docRef = await addDoc(collection(db, 'foodLog'), {
      food: 'Broccoli',
      createdAt: new Date().toISOString(),
    });
    console.log('Document written with ID:', docRef.id);
  } catch (error) {
    console.error('Error adding document:', error);
  }
}

window.testFirebase = testFirebase;
// Example of calling the function (you would trigger this from a form submission or button click)
// saveUserData("John Doe", "john.doe@example.com");
