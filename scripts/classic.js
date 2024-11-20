import { blocks } from "../data/blocks.js";

const blocksInput = document.querySelector('.js-blocks-input');
const autocompleteList = document.querySelector('.js-autocomplete-list');

function getSortedBlocks() {
  return blocks.sort((a, b) => a.name.localeCompare(b.name));
}

function filterBlocks(inputValue) {
  return getSortedBlocks().filter(block => block.name.toLowerCase().startsWith(inputValue));
}

function createBlockElement(block) {
  const div = document.createElement('div');
  div.classList.add('block-name-container');
  div.classList.add('js-block-name-container');
  div.innerHTML = `
    <img class="js-chosen-block-image" title = "${block.name}" src= '${block.image}'>
  `;

  return div;
}

function displayAutocompleteList(filteredBlocks) {
  autocompleteList.innerHTML = '';
  autocompleteList.classList.add('autocomplete-list-opacity');

  filteredBlocks.forEach(block => {
    const div = createBlockElement(block);
    autocompleteList.appendChild(div);

    div.addEventListener('click', () => {
      blocksInput.value = block.name;
      autocompleteList.innerHTML = '';
    });
  });
}

function onInputHandler() {
  const inputValue = this.value.toLowerCase();
 
  autocompleteList.classList.remove('autocomplete-list-opacity');

  if(inputValue.length === 0) {
    autocompleteList.innerHTML = '';
    return;
  }

  const filteredBlocks = filterBlocks(inputValue);
  displayAutocompleteList(filteredBlocks);
}

function toggleOffListOnClick() {
  document.addEventListener('click', (event) => {
    if(!blocksInput.contains(event.target) && !autocompleteList.contains(event.target)) {
      autocompleteList.innerHTML = '';
      autocompleteList.classList.remove('autocomplete-list-opacity');
    }
  });
}

function generateHtmlForBlock(block, comparisonResult = null) {
  const html = `
    <div class="individual-block-container js-individual-block-container"><img class="displayed-block-image" src="${block.image}"></div>
    <div class="individual-block-container js-individual-block-container">
      <p>${block.color[0]}</p>
      <p>${block.color[1]}</p>
      <p>${block.color[2]}</p>
    </div>
    <div class="individual-block-container js-individual-block-container">${block.craftable}</div>
    <div class="individual-block-container js-individual-block-container">
      <p>${block.realm[0]}</p>
      <p>${block.realm[1]}</p>
      <p>${block.realm[2]}</p>
    </div>
    <div class="individual-block-container js-individual-block-container">${block.tool}</div>
    <div class="individual-block-container js-individual-block-container">${block.version}</div>
    <div class="individual-block-container js-individual-block-container">${block.renewable}</div>
    <div class="individual-block-container js-individual-block-container">${block.flammable}</div>
    <div class="individual-block-container js-individual-block-container">
      <p>${block.variant[0]}</p>
      <p>${block.variant[1]}</p>
      <p>${block.variant[2]}</p>
    </div>
  `;

  const container = document.createElement('div');
  container.classList.add('chosen-blocks-container', 'js-chosen-block-container');
  container.innerHTML = html;

  if (comparisonResult) {
    const individualContainers = container.querySelectorAll('.js-individual-block-container');
    const attributes = [
      'image',
      'color',
      'craftable',
      'realm',
      'tool',
      'version',
      'renewable',
      'flammable',
      'variant',
    ];

    individualContainers.forEach((container, index) => {
      const attribute = attributes[index];

      container.classList.remove(
        'individual-block-container-true',
        'individual-block-container-false',
        'individual-block-container-mixed'
      );

      const result = comparisonResult[attribute];
      if (result) {
        container.classList.add(`individual-block-container-${result}`);
      }
    });
  }

  return container;
}

function compareAttributes(todaysArray, blockArray) {
  const filteredTodaysArray = todaysArray.filter((item) => item.trim() !== '');
  const filteredBlockArray = blockArray.filter((item) => item.trim() !== '');
  const matchCount = filteredTodaysArray.reduce((count, item) => {
    return filteredBlockArray.includes(item) ? count + 1 : count;
  }, 0);

  if (
    matchCount === filteredTodaysArray.length &&
    matchCount === filteredBlockArray.length
  ) {
    return 'true';
  } else if (matchCount > 0) {
    return 'mixed';
  } else {
    return 'false';
  }
}

function CompareWithTodaysBlock(block) {
  const todaysBlock = {
    name: 'Andesite',
    image: 'images/block-images/Andesite.webp',
    color: ['Grey', '', ''],
    craftable: 'Yes',
    realm: ['Overworld', '', ''],
    tool: 'Pickaxe',
    version: '1.8',
    renewable: 'Yes',
    flammable: 'No',
    variant: ['Block', 'Default', '']
  };

  const comparisonResult = {};

  for (const key in todaysBlock) {
    if (Array.isArray(todaysBlock[key])) {
      comparisonResult[key] = compareAttributes(todaysBlock[key], block[key]);
    } else {
      comparisonResult[key] = todaysBlock[key] === block[key] ? 'true' : 'false';
    }
  }

  return comparisonResult;
}

function displayComprasionResult() {
  const inputValue = blocksInput.value.trim().toLowerCase();
  const block = getSortedBlocks().find((b) => b.name.toLowerCase() === inputValue);
  const comparisonResult = CompareWithTodaysBlock(block);

  if (!comparisonResult) {
    const individualContainers = document.querySelectorAll('.js-individual-block-container').innerHTML = '';
    return;
  }

  const individualContainers = document.querySelectorAll('.js-individual-block-container');
  const attributes = [
    'image',
    'color',
    'craftable',
    'realm',
    'tool',
    'version',
    'renewable',
    'flammable',
    'variant',
  ];

  individualContainers.forEach((container, index) => {
    const attribute = attributes[index];

    container.classList.remove(
      'individual-block-container-true',
      'individual-block-container-false',
      'individual-block-container-mixed'
    );

    const result = comparisonResult[attribute];
    if (result) {
      container.classList.add(`individual-block-container-${result}`);
    }
  });
}

function registerEvent() {
  const pressButton = document.querySelector('.js-press-button');

  blocksInput.addEventListener('input', onInputHandler);
  pressButton.addEventListener('click', () => {
    createChosenBlockElement();
  });
  toggleOffListOnClick();
}

registerEvent();

function createChosenBlockElement() {
  const guessingContainer = document.querySelector('.js-guessing-container');
  const inputValue = blocksInput.value.trim().toLowerCase();
  const block = getSortedBlocks().find((b) => b.name.toLowerCase() === inputValue);

  if (!block) {
    return; 
  }
  const comparisonResult = CompareWithTodaysBlock(block);
  const chosenBlockElement = generateHtmlForBlock(block, comparisonResult);

  guessingContainer.insertBefore(chosenBlockElement, guessingContainer.firstChild);
}



