# Preply Vocab Scraper

Scrape your saved vocabulary from Preply into a clean CSV that you can easily import into Anki, Google Sheets, or your favorite flashcard tool.

No extensions, no installations, no API keys — just a bookmark.

---

## ✨ What It Does

1. Clicks every “Show more” button on your Preply vocabulary page so all your saved words appear.

2. Extracts each Spanish/English word pair.

3. Generates a clean CSV file that looks like this:

   ```text
   "Spanish","English"
   "me da pena","it makes me embarrassed / I feel shy"
   "aprovechar","to take advantage of / make the most of"
   ...
   ```

4. Displays a popup with:

   * The full CSV
   * A **Copy to clipboard** button for instant export

---

## 🧭 How to Set It Up (No Coding Required!)

If you’ve never used a bookmarklet before, don’t worry — it’s just a normal bookmark that runs a little bit of code when you click it.

### 🪄 Step-by-Step

1. **Copy the code**

   * Open the file `src/bookmarklet.min.js` in this repo.
   * Copy the entire single-line script. It will start with something like:

     ```text
     javascript:(async function(){...
     ```

2. **Create a new bookmark**

   * In Chrome or Firefox, right-click your bookmarks bar → select **Add Page...** or **Add Bookmark...**
   * For the **Name**, write something like `Preply → CSV`
   * In the **URL** field, paste the code you just copied (it must start with `javascript:`)
   * Save it.

3. ✅ Done! You now have a bookmark that runs the scraper.

---

## 🚀 How to Use It

1. Go to your **Preply Vocabulary** page (where your saved words are listed).
2. Wait for the page to finish loading completely.
3. Click your new bookmark (`Preply → CSV`).
4. A small popup will appear containing all your vocabulary as CSV text.

   * Click **Copy to clipboard**, or just press `Ctrl+C` (Windows) / `Cmd+C` (Mac) — the text is auto-selected.
5. Paste it anywhere you want (Anki, Google Sheets, Excel, Notion, etc.).

When you’re done, press **Close** to remove the popup.

---

## ⚙️ Advanced: Customizing or Editing

If you want to tweak what data is scraped (for example, add example sentences):

1. Open `src/preply-vocab-scraper.user.js` in a text editor.
2. Modify it as needed.
3. Re-minify the file using an online tool such as [javascript-minifier.com](https://javascript-minifier.com/).
4. Wrap the result in `javascript:( ... )` and replace your bookmark’s URL with the new code.

---

## 🧠 FAQ

### Does this send my vocab anywhere?

No. Everything happens locally in your browser. The script never connects to any external servers or APIs.

### What if Preply changes their layout?

If the script stops working, it’s likely because Preply changed some of their internal class names. You can:

1. Right-click on one of your vocab cards → **Inspect Element**.
2. Update the class names in the script (they look like `CardCoreWrapper-sc-5afc26f5-0`).
3. Re-minify and update your bookmarklet.

### Can I add more data (like example sentences)?

Absolutely! Just add more columns to the `rows` array in the script. For example:

```js
const rows = [["Spanish", "English", "Example"]];
rows.push([spanish, english, exampleSentence]);
```

---

## Note

This script only automates actions that a logged-in user could do manually: clicking “Show more,” reading text, and copying it. It does **not** access private APIs or data from other users.

However, automated scraping *may* technically violate Preply’s Terms of Service. In practice, this is safe for personal use.


---

## 🧾 License

**MIT License** — Free to use, modify, and share. If you improve it, contributions are welcome!

