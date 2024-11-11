import { blocks } from "../data/blocks.js";

const sortedBlocks = blocks.sort((a, b) => a.name.localeCompare(b.name));

const blocksInput = document.querySelector('.js-blocks-input');
const autocompleteList = document.querySelector('.js-autocomplete-list');

blocksInput.addEventListener('input', function() {
  const inputValue = this.value.toLowerCase();
  autocompleteList.innerHTML = '';
  autocompleteList.classList.add('autocomplete-list-opacity');

  if(inputValue.length === 0) {
    autocompleteList.classList.remove('autocomplete-list-opacity');
    return
  };
  

  const filteredBlocks = sortedBlocks.filter(block => {
    return block.name.toLowerCase().startsWith(inputValue);
  });

  filteredBlocks.forEach(block => {
    const div = document.createElement('div');
    div.classList.add('block-name-container');
    div.classList.add('js-block-name-container');
    div.innerHTML = `
    <img title = "${block.name}" src= '${block.image}'>
    `;
    autocompleteList.appendChild(div);

   

    div.addEventListener('click', () => {
      blocksInput.value = block.name;
      autocompleteList.innerHTML = '';
    });
  });
});

document.addEventListener('click', (event) => {
  if(!blocksInput.contains(event.target) && !autocompleteList.contains(event.target)) {
    autocompleteList.innerHTML = '';
    autocompleteList.classList.remove('autocomplete-list-opacity');
  }
});

function blockIsChosen() {
  
}

