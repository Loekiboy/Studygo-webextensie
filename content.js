// StudyGo & JojoSchool Woordenlijst Kopiëren Extension
// Content script that adds copy buttons to word lists

(function() {
  'use strict';

  // Configuration for different websites
  const siteConfigs = {
    studygo: {
      hostPattern: /studygo\.com/,
      // StudyGo specific selectors - these will need to be adjusted based on actual site structure
      wordListSelectors: [
        '.word-list',
        '.vocabulary-list',
        '[class*="word"]',
        'table.words',
        '.studygo-list'
      ],
      wordPairSelectors: {
        row: 'tr, .word-item, .word-row',
        term: 'td:first-child, .term, .word, [class*="dutch"], [class*="foreign"]',
        definition: 'td:last-child, .definition, .translation, [class*="translation"]'
      }
    },
    jojoschool: {
      hostPattern: /jojoschool\.nl/,
      // JojoSchool specific selectors - these will need to be adjusted based on actual site structure
      wordListSelectors: [
        '.word-list',
        '.vocabulary-list',
        '[class*="word"]',
        'table.words'
      ],
      wordPairSelectors: {
        row: 'tr, .word-item',
        term: 'td:first-child, .term, .word',
        definition: 'td:last-child, .definition, .translation'
      }
    }
  };

  // Determine which site we're on
  function getCurrentSite() {
    const hostname = window.location.hostname;
    for (const [siteName, config] of Object.entries(siteConfigs)) {
      if (config.hostPattern.test(hostname)) {
        return { name: siteName, config: config };
      }
    }
    return null;
  }

  // Extract word pairs from a word list element
  function extractWordPairs(listElement, config) {
    const wordPairs = [];
    const rows = listElement.querySelectorAll(config.wordPairSelectors.row);

    rows.forEach(row => {
      let term = null;
      let definition = null;

      // Try to find term
      const termElement = row.querySelector(config.wordPairSelectors.term);
      if (termElement) {
        term = termElement.textContent.trim();
      }

      // Try to find definition
      const definitionElement = row.querySelector(config.wordPairSelectors.definition);
      if (definitionElement) {
        definition = definitionElement.textContent.trim();
      }

      // Fallback: if we have a row but no term/definition found, try to split the row's text
      if (!term || !definition) {
        const cells = row.children;
        if (cells.length >= 2) {
          term = cells[0].textContent.trim();
          definition = cells[1].textContent.trim();
        }
      }

      // If we found both term and definition, add to list
      if (term && definition && term !== definition && term.length > 0 && definition.length > 0) {
        wordPairs.push({ term, definition });
      }
    });

    console.log(`[StudyGo Extension] Extracted ${wordPairs.length} word pairs from list`);
    return wordPairs;
  }

  // Format word pairs in Quizlet style (term TAB definition, one per line)
  function formatWordPairs(wordPairs) {
    return wordPairs.map(pair => `${pair.term}\t${pair.definition}`).join('\n');
  }

  // Copy text to clipboard
  async function copyToClipboard(text) {
    try {
      // Modern way using Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          document.body.removeChild(textArea);
          return true;
        } catch (err) {
          document.body.removeChild(textArea);
          return false;
        }
      }
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  }

  // Create and add copy button
  function addCopyButton(listElement, config) {
    // Check if button already exists
    if (listElement.querySelector('.copy-wordlist-btn')) {
      return;
    }

    const button = document.createElement('button');
    button.className = 'copy-wordlist-btn';
    button.textContent = '📋 Kopieer Woordenlijst';
    button.title = 'Kopieer deze woordenlijst in Quizlet-formaat';

    button.addEventListener('click', async function(e) {
      e.preventDefault();
      e.stopPropagation();

      // Extract word pairs
      const wordPairs = extractWordPairs(listElement, config);

      if (wordPairs.length === 0) {
        alert('Geen woordparen gevonden in deze lijst.');
        return;
      }

      // Format and copy
      const formattedText = formatWordPairs(wordPairs);
      const success = await copyToClipboard(formattedText);

      if (success) {
        // Show success feedback
        const originalText = button.textContent;
        button.textContent = `✓ Gekopieerd! (${wordPairs.length} woorden)`;
        button.classList.add('copied');
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('copied');
        }, 2000);
        
        console.log(`[StudyGo Extension] Successfully copied ${wordPairs.length} word pairs to clipboard`);
      } else {
        alert('Kopiëren mislukt. Probeer het opnieuw.');
        console.error('[StudyGo Extension] Failed to copy to clipboard');
      }
    });

    // Insert button at the top of the list or before it
    if (listElement.parentElement) {
      listElement.parentElement.insertBefore(button, listElement);
    } else {
      listElement.insertBefore(button, listElement.firstChild);
    }
  }

  // Find and process word lists
  function findAndProcessWordLists() {
    const site = getCurrentSite();
    if (!site) {
      console.log('Not on a supported website');
      return;
    }

    console.log(`StudyGo/JojoSchool Extension: Running on ${site.name}`);

    // Try each selector
    for (const selector of site.config.wordListSelectors) {
      const lists = document.querySelectorAll(selector);
      lists.forEach(list => {
        // Only process if it looks like it contains word pairs
        const rows = list.querySelectorAll(site.config.wordPairSelectors.row);
        if (rows.length > 0) {
          addCopyButton(list, site.config);
        }
      });
    }
  }

  // Initialize
  function init() {
    const site = getCurrentSite();
    if (site) {
      console.log(`[StudyGo Extension] Extension loaded on ${site.name}`);
    }
    
    // Run on page load
    findAndProcessWordLists();

    // Also run when DOM changes (for dynamically loaded content)
    const observer = new MutationObserver((mutations) => {
      findAndProcessWordLists();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
