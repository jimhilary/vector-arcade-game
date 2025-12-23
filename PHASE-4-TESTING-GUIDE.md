# 🧪 PHASE 4 TESTING GUIDE

## HOW TO TEST EVERYTHING (Step-by-Step)

Follow these steps **in order** to test all new features!

---

## 🎯 STEP 1: Activate the Plugin

**Why:** Plugin must be active for scores to save!

1. Go to: `http://wp-vector-game.test/wp-admin/plugins.php`
2. Find **"Vector Game API"**
3. Click **"Activate"**
4. Look for success message

**✅ Success if:** Green banner says "Plugin activated"

---

## 🎯 STEP 2: Test Welcome Screen

**What to test:** Onboarding instructions

1. Go to: `http://wp-vector-game.test/`
2. **Look for:**
   - Big title: "🚀 VECTOR ASTEROIDS"
   - Instructions grid (W, A, D, SPACE)
   - Scoring info (20, 50, 100 pts)
   - "PRESS SPACE TO START" button
   - "VIEW LEADERBOARD" button

3. **Try clicking:**
   - Click "PRESS SPACE TO START" → Should start game
   - OR Press SPACE key → Should start game
   - Click "VIEW LEADERBOARD" → Should open leaderboard panel

**✅ Success if:**
- All text is readable
- Buttons work
- Screen is green on black
- Looks professional

**🐛 If broken:**
- Check browser console (F12)
- Verify `style.css` loaded
- Refresh page (Ctrl+F5)

---

## 🎯 STEP 3: Test Game Stats Display

**What to test:** Top-left corner UI

1. Start the game (SPACE)
2. **Look at top-left corner for:**
   ```
   SCORE: 0    LIVES: 3    LEVEL: 1    [📊]
   ```

3. **Verify display:**
   - Score shows "0" at start
   - Lives shows "3"
   - Level shows "1"
   - Mini leaderboard button (📊) is visible

**✅ Success if:**
- All stats visible
- Green text with glow
- Clean layout

**🐛 If broken:**
- Stats might be overlapping
- Check CSS for `.game-ui`
- May need to adjust spacing

---

## 🎯 STEP 4: Test Level-Up Celebration

**What to test:** Popup at 500 points

1. **Start the game**
2. **Get to 500 points:**
   - Destroy 25 Large asteroids (20 pts each)
   - OR 10 Medium (50 pts each)
   - OR 5 Small (100 pts each)

3. **Watch for:**
   - Big yellow popup appears
   - Text says "🎉 LEVEL UP!"
   - Shows "LEVEL 2"
   - Says "Outstanding, Commander!"
   - Auto-closes after 3 seconds

4. **Check top-left:**
   - Level counter changed from 1 → 2

5. **Play more:**
   - At 1000 pts → Level 3 popup
   - At 1500 pts → Level 4 popup

**✅ Success if:**
- Popup appears at exactly 500, 1000, 1500, etc
- Animation is smooth
- Auto-closes after 3 seconds
- Level counter updates
- More asteroids spawn

**🐛 If broken:**
- Check console for `checkLevelUp` errors
- Verify modal CSS loaded
- Make sure level-up modal HTML exists

**⚡ Quick Test Cheat:**
- Open console (F12)
- Type: `game.score = 495`
- Destroy one small asteroid
- Should trigger level-up!

---

## 🎯 STEP 5: Test Leaderboard Panel

**What to test:** Slide-out score display

### 5A: Open Leaderboard

1. **Click 📊 button** in top-left
2. **Watch for:**
   - Panel slides in from right
   - Title: "🏆 LEADERBOARD"
   - Three filter buttons
   - Score list appears

**✅ Success if:** Panel smoothly slides in

### 5B: Test Filter Buttons

1. **Click [All Time]** button
   - Should show all scores
   - Button highlights (greener)

2. **Click [Today]** button
   - Shows only today's scores
   - Button highlights

3. **Click [This Week]** button
   - Shows last 7 days' scores
   - Button highlights

**✅ Success if:**
- Scores update when filter changes
- Active filter is highlighted
- No errors in console

### 5C: Check Score Display

**Look for:**
```
#1  🥇 Player1    5,000
#2  🥈 Player2    4,500
#3  🥉 Player3    4,200
#4     Player4    3,800
...
```

**Verify:**
- Rank numbers (#1, #2, #3...)
- Top 3 have medals (🥇🥈🥉)
- Player names display correctly
- Scores have comma formatting (5,000 not 5000)

**✅ Success if:** All entries readable, medals show, numbers formatted

### 5D: Close Leaderboard

1. Click **[CLOSE]** button at bottom
2. OR click 📊 button again

**✅ Success if:** Panel slides out smoothly

---

## 🎯 STEP 6: Test Game Over Screen

**What to test:** Death and score submission

1. **Die on purpose:**
   - Let asteroids hit you 3 times
   - OR crash into an asteroid

2. **Game Over screen appears:**
   ```
   💥 GAME OVER
   
   Final Score: 1,250
   Level Reached: 3
   
   [PLAY AGAIN]  [VIEW LEADERBOARD]
   ```

3. **Name prompt appears:**
   - Type your name
   - Click OK

4. **Check:**
   - Score submits (check console)
   - "Score submitted!" message
   - Buttons work

5. **Click [VIEW LEADERBOARD]:**
   - Opens leaderboard panel
   - Your score should be in the list!

6. **Click [PLAY AGAIN]:**
   - Game restarts
   - Score resets to 0
   - Lives back to 3
   - Level back to 1

**✅ Success if:**
- Game over shows correct stats
- Score saves to database
- Appears in leaderboard
- Restart works

---

## 🎯 STEP 7: Verify Database Storage

**What to test:** Scores actually saved

1. Go to: `http://localhost/phpmyadmin/`
2. Select your WordPress database
3. Find table: `wp_vector_game_scores`
4. Click "Browse"

**Look for your scores:**
```
| id | user_id | player_name | score | level | created_at          |
|----|---------|-------------|-------|-------|---------------------|
| 1  | NULL    | Player1     | 5000  | 10    | 2025-12-17 10:30:00 |
| 2  | NULL    | Player2     | 4500  | 9     | 2025-12-17 10:31:00 |
| 3  | NULL    | YOU         | 1250  | 3     | 2025-12-17 10:32:00 |
```

**✅ Success if:**
- Your score is in the table
- Date/time is correct
- All fields populated

---

## 🎯 STEP 8: Test Filter Logic

**What to test:** Today vs Week vs All Time

### Setup: Create Test Data

1. **Play game TODAY**, get 1,000 pts, submit
2. Wait or play more, get 2,000 pts, submit
3. Get 3,000 pts, submit

### Test Filters:

**[All Time] Filter:**
- Should show ALL 3 scores you just made
- Plus any older scores

**[Today] Filter:**
- Should show ALL 3 scores (made today)
- Should NOT show scores from yesterday

**[This Week] Filter:**
- Should show all scores from last 7 days
- Should NOT show scores older than 7 days

**✅ Success if:**
- Filters work correctly
- Dates are respected
- No old scores show in "Today"

**🧪 Advanced Test:**
1. Go to phpMyAdmin
2. Manually change a score's `created_at` to yesterday
3. Check leaderboard "Today" filter
4. That score should DISAPPEAR
5. Check "This Week" - should still be there
6. Check "All Time" - should still be there

---

## 🎯 STEP 9: Test Responsive Elements

**What to test:** Looks good on different screen sizes

### Desktop (1920x1080):
- [ ] Welcome screen fits
- [ ] Leaderboard panel doesn't overflow
- [ ] Game canvas is fullscreen
- [ ] All text readable

### Laptop (1366x768):
- [ ] Everything still visible
- [ ] Leaderboard might be wider ratio
- [ ] Still playable

### Tablet (768px width):
- [ ] Instruction grid stacks vertically
- [ ] Leaderboard goes fullscreen
- [ ] Game UI fits

**✅ Success if:** Game playable on all sizes

**Note:** Mobile not supported yet (needs touch controls)

---

## 🎯 STEP 10: Stress Testing

**What to test:** Does it break?

### Test A: Many Scores

1. Play 10+ games
2. Submit 10+ scores
3. Check leaderboard
4. Should handle well

**✅ Success if:** No lag, all scores display

### Test B: Long Names

1. Enter name: "VeryLongPlayerNameThatGoesOnAndOnAndOn"
2. Check leaderboard
3. Name should truncate or wrap

**✅ Success if:** Doesn't break layout

### Test C: Special Characters

1. Enter name: "Player★123 🚀"
2. Submit score
3. Check leaderboard
4. Should escape properly (no XSS)

**✅ Success if:** Name displays safely

### Test D: Rapid Clicking

1. Open/close leaderboard quickly (10x fast)
2. Should not break
3. Should not duplicate requests

**✅ Success if:** Stays stable

---

## 🎯 STEP 11: Performance Check

**What to test:** Game runs smoothly

1. **Open Performance Tools:**
   - Press F12
   - Go to "Performance" tab
   - Start recording

2. **Play game for 2 minutes:**
   - Lots of shooting
   - Many asteroids
   - Move around a lot

3. **Stop recording**

4. **Check:**
   - Frame rate stays ~60 FPS
   - No memory leaks
   - CPU usage reasonable

**✅ Success if:**
- 60 FPS maintained
- No lag spikes
- Memory stable

---

## 🐛 COMMON ISSUES & FIXES

### Issue: "Leaderboard shows 'Loading...' forever"

**Fix:**
1. Check plugin is active
2. Verify `vectorGameAjax` is defined (console)
3. Check AJAX URL in Network tab (F12)
4. Verify database table exists

### Issue: "Level-up modal doesn't show"

**Fix:**
1. Check console for errors
2. Verify `checkLevelUp()` is being called
3. Check score is actually >= 500
4. Verify modal CSS is loaded

### Issue: "Scores not saving"

**Fix:**
1. Check nonce is valid
2. Verify AJAX endpoint working
3. Check database connection
4. Look at Network tab for failed requests

### Issue: "Welcome screen doesn't disappear"

**Fix:**
1. Check `startGameFromWelcome()` function exists
2. Verify it's setting `game.state = 'start'`
3. Check for JavaScript errors
4. Try hard refresh (Ctrl+F5)

---

## ✅ FINAL CHECKLIST

**Everything Works If:**

- [ ] Welcome screen shows on load
- [ ] Instructions are clear
- [ ] Game starts when pressing SPACE
- [ ] Top-left stats display correctly
- [ ] Level-up popup appears at 500, 1000, 1500...
- [ ] Level counter increments
- [ ] More asteroids spawn each level
- [ ] Leaderboard button (📊) works
- [ ] Leaderboard panel slides in/out
- [ ] Filter buttons work (All/Today/Week)
- [ ] Scores display correctly
- [ ] Top 3 have medals (🥇🥈🥉)
- [ ] Game over screen shows final stats
- [ ] Name prompt appears
- [ ] Score saves to database
- [ ] Appears in leaderboard
- [ ] Play Again restarts game
- [ ] No console errors
- [ ] Performance is smooth
- [ ] Looks professional

**If ALL ✅ above = PHASE 4 COMPLETE!** 🎉

---

## 🎮 WHAT TO TELL A NEW PLAYER

"Here's how to test the game:

1. Go to http://wp-vector-game.test/
2. Read the welcome screen
3. Press SPACE to start
4. Try to reach 500 points (Level 2)
5. Watch for the Level-Up celebration!
6. Click the 📊 button to see leaderboard
7. Try different filters (Today, Week, All)
8. Play until you die
9. Enter your name
10. See your score on the leaderboard!

**Goal:** Reach Level 5 (2,000 points) and get in the Top 10!"

---

## 🚀 READY FOR PHASE 5?

**You're ready when:**
- All tests pass ✅
- No critical bugs 🐛
- User experience is smooth 🎮
- Leaderboard works 📊
- Everything looks professional 💎

**Phase 5 might include:**
- User login integration
- Personal score history
- Achievements/badges
- Sound effects
- Mobile touch controls
- Admin panel

---

**NOW GO TEST!** 🕹️

