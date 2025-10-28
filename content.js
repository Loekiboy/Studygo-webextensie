// StudyGo & JojoSchool Woordenlijst Kopiëren Extension
// Content script that adds copy buttons to word lists

(function() {
  'use strict';

  const DEBUG = true; // Enable verbose logging

  function log(...args) {
    if (DEBUG) {
      console.log('[StudyGo Extension]', ...args);
    }
  }

  function warn(...args) {
    console.warn('[StudyGo Extension]', ...args);
  }

  function error(...args) {
    console.error('[StudyGo Extension]', ...args);
  }

  // Configuration for different websites
  const siteConfigs = {
    studygo: {
      hostPattern: /studygo\.com/,
      // StudyGo specific selectors - comprehensive list with fallbacks
      wordListSelectors: [
        // Common table selectors
        'table',
        'table.words',
        'table.vocabulary',
        'table.wordlist',
        // Common div/list selectors
        '.word-list',
        '.vocabulary-list',
        '.wordlist',
        '.studygo-list',
        '.list-words',
        // Generic class patterns
        '[class*="word-list"]',
        '[class*="wordlist"]',
        '[class*="vocabulary"]',
        '[class*="vocab"]',
        // List elements
        'ul[class*="word"]',
        'ol[class*="word"]',
        // Container elements
        'div[class*="word-list"]',
        'div[class*="vocabulary"]'
      ],
      wordPairSelectors: {
        row: 'tr, .word-item, .word-row, .word-pair, .vocabulary-item, li[class*="word"], div[class*="word-item"]',
        term: 'td:first-child, .term, .word, .foreign, .source, [class*="term"], [class*="word"]:first-child, [class*="foreign"], [class*="source"]',
        definition: 'td:last-child, .definition, .translation, .target, [class*="definition"], [class*="translation"], [class*="target"]'
      }
    },
    jojoschool: {
      hostPattern: /jojoschool\.nl/,
      // JojoSchool specific selectors - comprehensive list with fallbacks
      wordListSelectors: [
        // Common table selectors
        'table',
        'table.words',
        'table.vocabulary',
        'table.wordlist',
        // Common div/list selectors
        '.word-list',
        '.vocabulary-list',
        '.wordlist',
        '.list-words',
        // Generic class patterns
        '[class*="word-list"]',
        '[class*="wordlist"]',
        '[class*="vocabulary"]',
        '[class*="vocab"]',
        // List elements
        'ul[class*="word"]',
        'ol[class*="word"]',
        // Container elements
        'div[class*="word-list"]',
        'div[class*="vocabulary"]'
      ],
      wordPairSelectors: {
        row: 'tr, .word-item, .word-row, .word-pair, .vocabulary-item, li[class*="word"], div[class*="word-item"]',
        term: 'td:first-child, .term, .word, .foreign, .source, [class*="term"], [class*="word"]:first-child, [class*="foreign"]',
        definition: 'td:last-child, .definition, .translation, .target, [class*="definition"], [class*="translation"], [class*="target"]'
      }
    }
  };

  // Determine which site we're on
  function getCurrentSite() {
    const hostname = window.location.hostname;
    log('Checking hostname:', hostname);
    for (const [siteName, config] of Object.entries(siteConfigs)) {
      if (config.hostPattern.test(hostname)) {
        log('Matched site:', siteName);
        return { name: siteName, config: config };
      }
    }
    log('No matching site found for hostname:', hostname);
    return null;
  }

  // Extract word pairs from a word list element
  function extractWordPairs(listElement, config) {
    const wordPairs = [];
    const rows = listElement.querySelectorAll(config.wordPairSelectors.row);
    log(`Found ${rows.length} potential word pair rows in list`);

    rows.forEach((row, index) => {
      let term = null;
      let definition = null;

      // Try to find term
      const termElement = row.querySelector(config.wordPairSelectors.term);
      if (termElement) {
        term = termElement.textContent.trim();
        log(`Row ${index}: Found term "${term}"`);
      }

      // Try to find definition
      const definitionElement = row.querySelector(config.wordPairSelectors.definition);
      if (definitionElement) {
        definition = definitionElement.textContent.trim();
        log(`Row ${index}: Found definition "${definition}"`);
      }

      // Fallback: if we have a row but no term/definition found, try to split the row's text
      if (!term || !definition) {
        const cells = row.children;
        if (cells.length >= 2) {
          term = cells[0].textContent.trim();
          definition = cells[1].textContent.trim();
          log(`Row ${index}: Using fallback - term "${term}", definition "${definition}"`);
        }
      }

      // If we found both term and definition, add to list
      if (term && definition && term !== definition && term.length > 0 && definition.length > 0) {
        wordPairs.push({ term, definition });
      } else {
        log(`Row ${index}: Skipping - term="${term}", definition="${definition}"`);
      }
    });

    log(`Extracted ${wordPairs.length} word pairs from list`);
    return wordPairs;
  }

  // Format word pairs in Quizlet style (term TAB definition, one per line)
  function formatWordPairs(wordPairs) {
    return wordPairs.map(pair => `${pair.term}\t${pair.definition}`).join('\n');
  }

  // Copy text to clipboard
  async function copyToClipboard(text) {
    try {
      // Modern way using Clipboard API (works in Manifest V3 without clipboardWrite permission)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        log('Successfully copied to clipboard using Clipboard API');
        return true;
      } else {
        // Fallback for older browsers or non-secure contexts
        log('Clipboard API not available, using fallback method');
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);
          if (successful) {
            log('Successfully copied to clipboard using execCommand');
            return true;
          } else {
            error('execCommand copy returned false');
            return false;
          }
        } catch (err) {
          error('execCommand copy failed:', err);
          document.body.removeChild(textArea);
          return false;
        }
      }
    } catch (err) {
      error('Failed to copy to clipboard:', err);
      return false;
    }
  }

  // Create and add copy button
  function addCopyButton(listElement, config) {
    // Check if button already exists
    if (listElement.querySelector('.copy-wordlist-btn')) {
      log('Button already exists for this list, skipping');
      return;
    }

    // Extract word pairs first to check if there are any
    const testPairs = extractWordPairs(listElement, config);
    if (testPairs.length === 0) {
      log('No word pairs found in list element, not adding button');
      return;
    }

    log(`Adding copy button for list with ${testPairs.length} word pairs`);

    const button = document.createElement('button');
    button.className = 'copy-wordlist-btn';
    button.textContent = '📋 Kopieer Woordenlijst';
    button.title = 'Kopieer deze woordenlijst in Quizlet-formaat';

    button.addEventListener('click', async function(e) {
      e.preventDefault();
      e.stopPropagation();

      log('Copy button clicked');

      // Extract word pairs
      const wordPairs = extractWordPairs(listElement, config);

      if (wordPairs.length === 0) {
        const message = 'Geen woordparen gevonden in deze lijst.';
        alert(message);
        warn(message);
        return;
      }

      // Format and copy
      const formattedText = formatWordPairs(wordPairs);
      log('Formatted text for clipboard:', formattedText);
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
        
        log(`Successfully copied ${wordPairs.length} word pairs to clipboard`);
      } else {
        const message = 'Kopiëren mislukt. Probeer het opnieuw.';
        alert(message);
        error('Failed to copy to clipboard');
      }
    });

    // Insert button at the top of the list or before it
    if (listElement.parentElement) {
      listElement.parentElement.insertBefore(button, listElement);
      log('Button inserted before list element');
    } else {
      listElement.insertBefore(button, listElement.firstChild);
      log('Button inserted as first child of list element');
    }
  }

  // Find and process word lists
  function findAndProcessWordLists() {
    const site = getCurrentSite();
    if (!site) {
      log('Not on a supported website');
      return;
    }

    log(`Running on ${site.name}`);
    let foundLists = 0;
    let processedLists = 0;

    // Try each selector
    for (const selector of site.config.wordListSelectors) {
      const lists = document.querySelectorAll(selector);
      if (lists.length > 0) {
        log(`Found ${lists.length} potential word lists using selector: ${selector}`);
      }
      
      lists.forEach(list => {
        foundLists++;
        // Only process if it looks like it contains word pairs
        const rows = list.querySelectorAll(site.config.wordPairSelectors.row);
        if (rows.length > 0) {
          log(`Processing list with ${rows.length} rows (selector: ${selector})`);
          addCopyButton(list, site.config);
          processedLists++;
        } else {
          log(`Skipping list - no rows found (selector: ${selector})`);
        }
      });
    }

    if (foundLists === 0) {
      warn('No word lists found on this page. The page structure may have changed.');
      warn('Current URL:', window.location.href);
      warn('Please report this issue with the URL so we can update the selectors.');
    } else if (processedLists === 0) {
      warn(`Found ${foundLists} potential lists but none had valid word pairs.`);
      warn('The page structure may have changed or this is not a word list page.');
    } else {
      log(`Successfully processed ${processedLists} word lists out of ${foundLists} found.`);
    }
  }

  // Initialize
  function init() {
    const site = getCurrentSite();
    if (!site) {
      log('Extension loaded but not on a supported site (studygo.com or jojoschool.nl)');
      return;
    }
    
    log(`Extension loaded on ${site.name}`);
    log('Extension version: 1.0.1');
    log('URL:', window.location.href);
    
    // Run on page load
    findAndProcessWordLists();

    // Also run when DOM changes (for dynamically loaded content)
    const observer = new MutationObserver((mutations) => {
      log('DOM changed, re-scanning for word lists');
      findAndProcessWordLists();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    log('MutationObserver started - will detect dynamically loaded content');
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    log('DOM is still loading, waiting for DOMContentLoaded event');
    document.addEventListener('DOMContentLoaded', init);
  } else {
    log('DOM already loaded, initializing immediately');
    init();
  }
})();
