# 📖 Complete Setup Guide - Vector Arcade Game

## 🎯 Quick Start (5 Minutes)

### Step 1: Clone the Repository
```bash
git clone https://github.com/jimhilary/vector-arcade-game.git
cd vector-arcade-game
```

### Step 2: Start Local Server
```bash
# Option A: Python (if installed)
python -m http.server 8000

# Option B: Node.js (if installed)
npx http-server

# Option C: PHP (if installed)
php -S localhost:8000
```

### Step 3: Open in Browser
```
http://localhost:8000/docs/
```

**That's it!** The game should load and be playable.

---

## 🔄 Pulling Updates

### When You Want to Work on the Project Again

```bash
# 1. Clone fresh (if you deleted local copy)
git clone https://github.com/jimhilary/vector-arcade-game.git
cd vector-arcade-game

# 2. Or if you kept the folder, just pull updates
git pull origin main

# 3. Start local server
python -m http.server 8000

# 4. Open browser
# http://localhost:8000/docs/
```

---

## ✏️ Making Changes

### Edit Game Logic
```bash
# 1. Open docs/game.js in your editor
# 2. Make your changes
# 3. Save file
# 4. Refresh browser (Ctrl+R or Cmd+R)
# 5. Test your changes
```

### Edit Styling
```bash
# 1. Open docs/style.css in your editor
# 2. Make your changes
# 3. Save file
# 4. Refresh browser
```

### Edit HTML Structure
```bash
# 1. Open docs/index.html in your editor
# 2. Make your changes
# 3. Save file
# 4. Refresh browser
```

---

## 💾 Saving Your Changes

### Commit and Push to GitHub

```bash
# 1. Check what files changed
git status

# 2. Add files you want to commit
git add docs/game.js docs/style.css docs/index.html

# 3. Commit with a message
git commit -m "Description of what you changed"

# 4. Push to GitHub
git push origin main
```

**Note:** GitHub Pages automatically deploys from `main` branch, so your changes will be live in 1-2 minutes!

---

## 🗑️ Deleting Local Project

### When You're Done Working

```bash
# 1. Make sure all changes are committed and pushed
git status  # Should show "nothing to commit"
git push origin main  # Make sure everything is pushed

# 2. Navigate out of the project folder
cd ..

# 3. Delete the folder
# Windows:
rmdir /s vector-arcade-game

# Mac/Linux:
rm -rf vector-arcade-game
```

**Don't worry!** Everything is saved on GitHub. You can always clone it again later.

---

## 🔄 Complete Workflow Example

### Scenario: You want to add a new feature

```bash
# 1. Clone project (if you don't have it)
git clone https://github.com/jimhilary/vector-arcade-game.git
cd vector-arcade-game

# 2. Start local server
python -m http.server 8000

# 3. Open browser to http://localhost:8000/docs/

# 4. Make changes in your editor
#    - Edit docs/game.js
#    - Test in browser
#    - Fix bugs
#    - Test again

# 5. When satisfied, commit and push
git add docs/game.js
git commit -m "Added new feature: [describe what you added]"
git push origin main

# 6. Wait 1-2 minutes, then check live site
# https://jimhilary.github.io/vector-arcade-game/

# 7. Delete local copy (optional, to save space)
cd ..
rmdir /s vector-arcade-game
```

---

## 📁 Important Files to Know

### Files You'll Edit Most Often
- `docs/game.js` - All game logic (3,100+ lines)
- `docs/style.css` - All styling
- `docs/index.html` - HTML structure

### Files You Rarely Touch
- `docs/audio-base64.js` - Auto-generated, don't edit manually
- `docs/.nojekyll` - GitHub Pages config, don't touch
- `generate-audio-base64.js` - Only if you change audio file

### Files You Never Touch
- `.gitignore` - Git configuration
- `.gitattributes` - Git LFS config
- `README.md` - Project documentation

---

## 🎵 Regenerating Audio Base64

### Only if you change the audio file

```bash
# 1. Replace docs/assets/audio.mp3 with your new file

# 2. Run the generator script
node generate-audio-base64.js

# 3. Commit the new audio-base64.js
git add docs/audio-base64.js
git commit -m "Updated background music"
git push origin main
```

---

## 🐛 Common Issues

### "Game doesn't load"
- Check browser console (F12) for errors
- Make sure you're opening `http://localhost:8000/docs/` not just `http://localhost:8000/`
- Verify all files are in the `docs/` folder

### "Audio doesn't play"
- Check if `audio-base64.js` is loading (Network tab)
- Verify file size is ~4MB
- Check browser console for errors

### "Leaderboard doesn't work"
- Check Supabase API key in `docs/game.js`
- Verify Supabase table exists
- Check browser console for API errors

### "Changes not showing"
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Check if you're editing the right files

---

## 💡 Tips

1. **Always test locally** before pushing to GitHub
2. **Use browser DevTools** (F12) to debug
3. **Check console** for errors
4. **Commit often** with clear messages
5. **Pull before editing** if working on multiple machines

---

## 📞 Need Help?

1. Check `DEPLOYMENT.md` for detailed info
2. Review phase documentation files
3. Check browser console for errors
4. Review GitHub Issues

---

**Remember:** Everything is saved on GitHub. You can delete your local copy anytime and clone it fresh when needed!

