// Load recipes dynamically
document.querySelectorAll('[data-load]').forEach(link => {
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    const month = link.dataset.load;
    
    const response = await fetch(`recipes/${month}.html`);
    const html = await response.text();
    
    document.getElementById('recipes-container').innerHTML = html;
    
    document.querySelectorAll('.recipe-nav li').forEach(li => li.classList.remove('active'));
    link.parentElement.classList.add('active');
    
    document.querySelector('.recipes-main').scrollIntoView();
  });
});

async function loadRecipeIndex() {
  const recipes = [
    // 4-6 Months
    { name: "Avocado Basil Puree", id: "avocado-basil-puree", month: "4-6-months" },
    { name: "Aubergine Pepper Sweet Potato", id: "aubergine-pepper-sweet-potato", month: "4-6-months" },
    { name: "Butternut Squash Mint Broccoli", id: "butternut-squash-mint-broccoli-courgette-puree", month: "4-6-months" },
    { name: "Butternut Squash Sweetcorn Carrot", id: "butternut-squash-sweetcorn-carrot-puree", month: "4-6-months" },
    { name: "Brussels Sprouts Puree", id: "brussels-sprouts-puree", month: "4-6-months" },
    { name: "Carrot Puree", id: "carrot-puree", month: "4-6-months" },
    { name: "Broccoli Puree", id: "broccoli-puree", month: "4-6-months" },
    
    // 6 Months
    { name: "Bright Start Breakfast Bowl", id: "bright-start-breakfast-bowl", month: "6-months" },
    { name: "Herby Scrambled Egg", id: "herby-scrambled-egg", month: "6-months" },
    { name: "My First Chicken Curry", id: "my-first-chicken-curry", month: "6-months" },
    { name: "Pea and Ham Bake", id: "pea-and-ham-bake", month: "6-months" },
    { name: "Creamy Hotpot", id: "creamy-hotpot", month: "6-months" },
    { name: "Cheese and Mushroom Cakes", id: "cheese-and-mushroom-cakes", month: "6-months" },
    { name: "Smashed Avocado Banana", id: "smashed-avocado-and-banana", month: "6-months" },
    { name: "Simple Baked Fish", id: "simple-baked-fish", month: "6-months" },
    { name: "Crustless Mini Quiche", id: "crustless-mini-quiche", month: "6-months" },
    { name: "Steamed Apple Pear", id: "steamed-apple-and-pear", month: "6-months" },
    { name: "Yummy Fish Pie", id: "yummy-fish-pie", month: "6-months" },
    
    // 10 Months
    { name: "Cheesy Tomato Pitta Pizzas", id: "cheesy-tomato-pitta-pizzas", month: "10-months" },
    { name: "Baked Bean Breakfast Pancakes", id: "baked-bean-breakfast-pancakes", month: "10-months" },
    { name: "Smoky Bean One-Pot Hotpot", id: "smoky-bean-one-pot-hotpot", month: "10-months" },
    { name: "Green Bean Basil Pasta", id: "green-bean-basil-pasta", month: "10-months" },
    { name: "Cheesy Broccoli Potato Gratin", id: "cheesy-broccoli-potato-gratin", month: "10-months" },
    { name: "On The Go Porridge Bars", id: "on-the-go-porridge-bars", month: "10-months" },
    { name: "Fruity Delicious Porridge", id: "fruity-delicious-porridge", month: "10-months" }
  ];

  document.addEventListener('click', (e) => {
  if (e.target.classList.contains('recipe-link')) {
    e.preventDefault();
    const month = e.target.dataset.month;
    
    // Load correct month first
    document.querySelector(`[data-load="${month}"]`).click();
    
    // Then scroll to recipe (small delay for content to load)
    setTimeout(() => {
      const recipeId = e.target.getAttribute('href').slice(1); // Remove #
      const recipe = document.getElementById(recipeId);
      if (recipe) {
        recipe.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  }
});

  const listHTML = recipes.map(r => `
    <a href="#${r.id}" class="recipe-link" data-month="${r.month}">
      ${r.name}
    </a>
  `).join('');
  
  document.querySelector('.recipe-list').innerHTML = listHTML;
}

// Search + Load on page load
document.addEventListener('DOMContentLoaded', async () => {
  await loadRecipeIndex();
  
  const searchInput = document.getElementById('recipe-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      document.querySelectorAll('.recipe-link').forEach(link => {
        const matches = link.textContent.toLowerCase().includes(term);
        link.style.display = matches ? 'block' : 'none';
      });
    });
  }
  
  document.querySelector('[data-load="4-6-months"]').click();
});

// Add toggle functionality
document.getElementById('recipe-toggle').addEventListener('click', () => {
  document.querySelector('.recipe-index').classList.toggle('collapsed');
});

// Update count in toggle
function updateRecipeCount(count) {
  document.getElementById('recipe-count').textContent = count;
}

// In loadRecipeIndex(), after generating list:
updateRecipeCount(recipes.length);
