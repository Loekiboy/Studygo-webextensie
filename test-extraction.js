// Test script to verify word extraction logic works with practice format
// This simulates the extension behavior without needing a browser

const fs = require('fs');
const { JSDOM } = require('jsdom');

// Read the test HTML file
const html = fs.readFileSync('studygo-practice-test.html', 'utf-8');

// Create a DOM from the HTML
const dom = new JSDOM(html);
const document = dom.window.document;

// Extract the relevant functions from content.js and test them
function cleanText(text) {
  if (!text) return '';
  
  // Remove common feedback indicators and prefixes
  let cleaned = text
    .replace(/^[✓✗✅❌]/g, '') // Remove checkmarks and X marks at start
    .replace(/\s*[✓✗✅❌]\s*/g, ' ') // Remove checkmarks anywhere with spaces
    .replace(/jouw antwoord:.*$/i, '') // Remove "your answer: ..." text (case insensitive)
    .replace(/your answer:.*$/i, '') // English version
    .replace(/correct$/i, '') // Remove "correct" suffix
    .replace(/incorrect$/i, '') // Remove "incorrect" suffix
    .replace(/goed$/i, '') // Remove "goed" (correct in Dutch)
    .replace(/fout$/i, '') // Remove "fout" (wrong in Dutch)
    .trim();
  
  return cleaned;
}

// Helper function to check if a row looks like a header
function isHeaderRow(row, term, definition) {
  // Check if parent is thead
  if (row.closest('thead')) {
    return true;
  }
  
  // Check if the row is a th element
  if (row.tagName === 'TH' || row.querySelector('th')) {
    return true;
  }
  
  // Common header patterns (case insensitive)
  const headerPatterns = [
    /^(engels?|english|term|woord|word|vreemde?\s*taal)$/i,
    /^(nederlands?|dutch|definition|vertaling|translation|moedertaal)$/i,
    /^(term|definition)$/i,
    /^(vraag|question|antwoord|answer)$/i,
    /^(foreign|native|target|source)$/i
  ];
  
  const termLower = term.toLowerCase();
  const defLower = definition.toLowerCase();
  
  for (const pattern of headerPatterns) {
    if (pattern.test(termLower) || pattern.test(defLower)) {
      return true;
    }
  }
  
  return false;
}

function extractWordPairs(listElement, config) {
  const wordPairs = [];
  const rows = listElement.querySelectorAll(config.wordPairSelectors.row);
  console.log(`Found ${rows.length} potential word pair rows in list`);

  rows.forEach((row, index) => {
    let term = null;
    let definition = null;

    // Try to find term
    const termElement = row.querySelector(config.wordPairSelectors.term);
    if (termElement) {
      term = cleanText(termElement.textContent);
      console.log(`Row ${index}: Found term "${term}"`);
    }

    // Try to find definition - handle nested structure
    const definitionElement = row.querySelector(config.wordPairSelectors.definition);
    if (definitionElement) {
      // For practice mode, get only the first direct text element (ignore "your answer" etc)
      let defText = '';
      
      // Check if there are child elements - if so, try to get the first meaningful one
      const childDivs = definitionElement.querySelectorAll('div, span');
      if (childDivs.length > 0) {
        // Get the first child that doesn't contain "answer" text
        for (const child of childDivs) {
          const childText = child.textContent.trim();
          if (childText && !childText.match(/jouw antwoord|your answer/i)) {
            defText = childText;
            break;
          }
        }
      }
      
      // Fallback to full text content if no children found
      if (!defText) {
        defText = definitionElement.textContent;
      }
      
      definition = cleanText(defText);
      console.log(`Row ${index}: Found definition "${definition}"`);
    }

    // Fallback: if we have a row but no term/definition found, try to split the row's text
    if (!term || !definition) {
      const cells = row.children;
      if (cells.length >= 2) {
        // Skip first child if it looks like a feedback icon (has only symbols)
        let startIndex = 0;
        if (cells[0] && cells[0].textContent.trim().match(/^[✓✗✅❌]+$/)) {
          startIndex = 1;
        }
        
        if (cells.length > startIndex + 1) {
          term = cleanText(cells[startIndex].textContent);
          definition = cleanText(cells[startIndex + 1].textContent);
          console.log(`Row ${index}: Using fallback - term "${term}", definition "${definition}"`);
        }
      }
    }

    // Skip header rows
    if (term && definition && isHeaderRow(row, term, definition)) {
      console.log(`Row ${index}: ⊘ Skipping header row - term="${term}", definition="${definition}"`);
      return;
    }

    // If we found both term and definition, add to list
    if (term && definition && term !== definition && term.length > 0 && definition.length > 0) {
      wordPairs.push({ term, definition });
      console.log(`Row ${index}: ✓ Added pair: "${term}" -> "${definition}"`);
    } else {
      console.log(`Row ${index}: ✗ Skipping - term="${term}", definition="${definition}"`);
    }
  });

  return wordPairs;
}

// Test configuration (same as in content.js)
const config = {
  wordPairSelectors: {
    row: 'tr, .word-item, .word-row, .word-pair, .vocabulary-item, .practice-item, li[class*="word"], div[class*="word-item"], div[class*="practice-item"], [class*="correct"], [class*="incorrect"]',
    term: 'td:first-child, .term, .word, .foreign, .source, .foreign-word, [class*="term"], [class*="word"]:first-child, [class*="foreign"], [class*="source"]',
    definition: 'td:last-child, .definition, .translation, .target, [class*="definition"], [class*="translation"], [class*="target"]'
  }
};

// Test Scenario 1: Practice format
console.log('\n=== Testing Scenario 1: Practice Resultaten ===');
const practiceList = document.querySelector('.practice-list');
if (practiceList) {
  const pairs1 = extractWordPairs(practiceList, config);
  console.log('\nExtracted pairs:', pairs1);
  console.log(`Total: ${pairs1.length} pairs`);
} else {
  console.log('ERROR: Could not find .practice-list');
}

// Test Scenario 2: Traditional table
console.log('\n=== Testing Scenario 2: Traditional Table ===');
const table = document.querySelector('table.words');
if (table) {
  const pairs2 = extractWordPairs(table, config);
  console.log('\nExtracted pairs:', pairs2);
  console.log(`Total: ${pairs2.length} pairs`);
} else {
  console.log('ERROR: Could not find table.words');
}

// Test Scenario 3: List format
console.log('\n=== Testing Scenario 3: List Format ===');
const studygoList = document.querySelector('.studygo-list');
if (studygoList) {
  const pairs3 = extractWordPairs(studygoList, config);
  console.log('\nExtracted pairs:', pairs3);
  console.log(`Total: ${pairs3.length} pairs`);
} else {
  console.log('ERROR: Could not find .studygo-list');
}
