// preply-vocab-scraper.user.js
// --------------------------------------
// Preply Vocab Scraper
// --------------------------------------
// What it does:
// 1. Expands all "Show more" sections on a Preply vocab page
// 2. Scrapes Spanish/English word pairs
// 3. Generates a CSV
// 4. Pops up a floating panel so you can copy the CSV
//
// This file is the human-readable version.
// The `bookmarklet.min.js` file is the minified version you actually
// paste into your browser bookmark (must start with "javascript:").
//
// Tested in Firefox
//
// --------------------------------------

(async function scrapePreplyVocab() {
  // -- Step 1: expand all "Show more" cards so all vocab is visible --
  async function expandAll() {
    function getShowMoreBtn() {
      return Array.from(document.querySelectorAll('button'))
        .find(btn => btn.textContent.trim().includes('Show more'));
    }

    // Click all "Show more" buttons one by one, with a short delay
    while (true) {
      const btn = getShowMoreBtn();
      if (!btn) break;
      btn.click();
      // Give Preply a moment to inject more cards into the DOM
      await new Promise(res => setTimeout(res, 800));
    }
  }

  await expandAll();

  // -- Step 2: collect all vocab cards --
  //
  // NOTE: These selectors are reverse-engineered from Preply's UI.
  // If Preply changes class names like `CardCoreWrapper-sc-5afc26f5-0`
  // or `Text__uVacy TextAccent__AfPNQ`, this will stop working and
  // you'll have to re-inspect the DOM.
  //
  const cards = document.querySelectorAll('div.CardCoreWrapper-sc-5afc26f5-0');

  // We'll build rows -> CSV
  const rows = [["Spanish", "English"]];

  cards.forEach(card => {
    const texts = card.querySelectorAll('p.Text__uVacy.TextAccent__AfPNQ');

    // We're assuming:
    //   texts[0] = Spanish phrase
    //   texts[1] = English translation
    if (texts.length >= 2) {
      const spanish = texts[0].innerText.trim();
      const english = texts[1].innerText.trim();

      const looksLikeNoise = /^(Practice now|\d+ words?)$/i.test(spanish);
      const tooLong = english.length >= 100 || spanish.length >= 40;

      if (
        spanish.length > 0 &&
        english.length > 0 &&
        !looksLikeNoise &&
        !tooLong
      ) {
        rows.push([spanish, english]);
      }
    }
  });

  // -- Step 3: build CSV string with proper escaping --
  //
  // We wrap every field in double quotes, and double-up any existing quotes.
  //
  const csv = rows
    .map(r =>
      r
        .map(field => `"${field.replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n');

  // -- Step 4: inject UI so user can copy/save the CSV easily --
  const container = document.createElement('div');

  // Escape "<" so we don't accidentally inject HTML inside the <textarea>
  const safeCsv = csv.replace(/</g, '&lt;');

  container.innerHTML = `
    <div style="
      position:fixed;
      top:10%;
      left:50%;
      transform:translateX(-50%);
      z-index:99999;
      background:#fff;
      padding:1em 1em .75em;
      border:2px solid #444;
      box-shadow:0 12px 24px rgba(0,0,0,.2);
      border-radius:8px;
      max-width:90vw;
      font-family:sans-serif;
    ">
      <h3 style="margin-top:0;font-size:16px;line-height:1.3;">
        Preply Vocab CSV
      </h3>

      <textarea
        id="csvbox"
        style="
          width:400px;
          max-width:80vw;
          height:300px;
          font-size:12px;
          font-family:monospace;
          white-space:pre;
          line-height:1.4;
        "
      >${safeCsv}</textarea>

      <div style="
        margin-top:.5em;
        display:flex;
        gap:.5em;
        flex-wrap:wrap;
      ">
        <button
          id="copyCsvBtn"
          style="
            cursor:pointer;
            padding:.4em .6em;
            font-size:12px;
            border-radius:4px;
            border:1px solid #222;
            background:#eee;
            font-family:sans-serif;
          "
        >
          Copy to clipboard
        </button>

        <button
          id="closeCsvBtn"
          style="
            cursor:pointer;
            padding:.4em .6em;
            font-size:12px;
            border-radius:4px;
            border:1px solid #222;
            background:#eee;
            font-family:sans-serif;
          "
        >
          Close
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  const csvBox  = document.getElementById('csvbox');
  const copyBtn = document.getElementById('copyCsvBtn');
  const closeBtn= document.getElementById('closeCsvBtn');

  // auto-select for instant Ctrl/Cmd+C
  csvBox.select();

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(csv);
      copyBtn.textContent = 'Copied!';
    } catch (e) {
      // Fallback for weird browser perms
      csvBox.select();
      copyBtn.textContent = 'Select + copy manually';
    }
  });

  closeBtn.addEventListener('click', () => {
    container.remove();
  });
})();

