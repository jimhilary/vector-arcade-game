# PHASE 2: Backend API (WordPress Way)

## ARCHITECTURE REMINDER

This never changes:

```
Browser (Frontend)
  ↓
Theme (HTML + Canvas + JS)      ← Phase 1: Game Logic
  ↓
WordPress AJAX / REST           ← Phase 2: API Layer (YOU ARE HERE)
  ↓
MySQL                           ← Phase 3: Database Storage
```

---

## 🎯 GOAL

Enable the game to communicate with the WordPress backend using AJAX. Scores are **received** but **NOT stored yet** (that's Phase 3).

---

## 📂 PLUGIN STRUCTURE

### Why a Plugin Instead of Theme?

- **Themes** = Presentation & Frontend Logic
- **Plugins** = Features & Backend Logic
- **Best Practice:** Game API should be independent of the theme

### Plugin Location

```
wp-content/
└── plugins/
    └── vector-game-api/
        └── vector-game-api.php
```

### Plugin File: `vector-game-api.php`

This is the main plugin file that:
1. Registers with WordPress
2. Creates AJAX endpoints
3. Handles score submission
4. Validates and sanitizes data

---

## 🔐 SECURITY: WordPress Nonces

### What is a Nonce?

**Nonce** = "Number Used Once"
- A security token that expires
- Prevents CSRF (Cross-Site Request Forgery) attacks
- WordPress generates it, validates it

### How We Use It:

1. **Plugin creates nonce:**
   ```php
   wp_create_nonce('vg_submit_score_nonce')
   ```

2. **Localized to JavaScript:**
   ```php
   wp_localize_script('vector-game-script', 'vectorGameAjax', array(
       'ajaxurl' => admin_url('admin-ajax.php'),
       'nonce'   => wp_create_nonce('vg_submit_score_nonce'),
   ));
   ```

3. **JavaScript sends nonce with request:**
   ```javascript
   nonce: vectorGameAjax.nonce
   ```

4. **Plugin verifies nonce:**
   ```php
   wp_verify_nonce($_POST['nonce'], 'vg_submit_score_nonce')
   ```

---

## 🔌 AJAX ENDPOINTS

### WordPress AJAX System

WordPress has a built-in AJAX handler: `wp-admin/admin-ajax.php`

### Two Types of Actions:

1. **`wp_ajax_{action}`** - For logged-in users
2. **`wp_ajax_nopriv_{action}`** - For non-logged-in users

### Our Implementation:

```php
// For logged-in users
add_action('wp_ajax_vg_submit_score', array($this, 'submit_score'));

// For guest players (anyone can play!)
add_action('wp_ajax_nopriv_vg_submit_score', array($this, 'submit_score'));
```

**Action Name:** `vg_submit_score`
- `vg` = Vector Game (prefix to avoid conflicts)
- `submit_score` = What it does

---

## 📥 DATA FLOW

### 1. Game Over (JavaScript)

```javascript
// In game.js
function gameOver() {
    game.state = 'gameover';
    submitScore();  // ← Calls our new function
}
```

### 2. Score Submission (JavaScript → PHP)

```javascript
function submitScore() {
    // Prompt for player name
    const playerName = prompt('Enter your name:', 'Anonymous');
    
    // Prepare data
    const scoreData = {
        action: 'vg_submit_score',     // ← WordPress action
        nonce: vectorGameAjax.nonce,   // ← Security token
        score: game.score,              // ← Player's score
        player_name: playerName,        // ← Player's name
        level: game.level               // ← Game level reached
    };
    
    // Send AJAX request
    fetch(vectorGameAjax.ajaxurl, {
        method: 'POST',
        body: new URLSearchParams(scoreData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Score submitted!', data);
    });
}
```

### 3. Backend Processing (PHP)

```php
public function submit_score() {
    // 1. VERIFY NONCE (Security)
    if (!wp_verify_nonce($_POST['nonce'], 'vg_submit_score_nonce')) {
        wp_send_json_error(['message' => 'Security check failed'], 403);
    }
    
    // 2. SANITIZE INPUT (Clean data)
    $score = absint($_POST['score']);                      // Integer only
    $player_name = sanitize_text_field($_POST['player_name']); // Remove HTML/scripts
    $level = absint($_POST['level']);                      // Integer only
    
    // 3. VALIDATE DATA (Check rules)
    if ($score < 0) {
        wp_send_json_error(['message' => 'Invalid score'], 400);
    }
    if (strlen($player_name) > 50) {
        wp_send_json_error(['message' => 'Name too long'], 400);
    }
    
    // 4. LOG RECEIPT (Phase 2: not storing yet)
    error_log('Score received: ' . json_encode([
        'score' => $score,
        'player_name' => $player_name,
        'level' => $level
    ]));
    
    // 5. SEND SUCCESS RESPONSE
    wp_send_json_success([
        'message' => 'Score received!',
        'data' => ['score' => $score, 'player_name' => $player_name]
    ]);
}
```

---

## 🛡️ DATA VALIDATION & SANITIZATION

### Why Both?

- **Sanitization** = Clean the data (remove dangerous stuff)
- **Validation** = Check if data follows rules

### WordPress Sanitization Functions:

| Function | Purpose | Example |
|----------|---------|---------|
| `absint()` | Absolute integer (no negatives) | `absint('42')` → `42` |
| `sanitize_text_field()` | Remove HTML tags, extra spaces | `sanitize_text_field('<script>alert</script>')` → `alert` |
| `sanitize_email()` | Validate email format | `sanitize_email('test@example.com')` |
| `esc_url()` | Sanitize URL | `esc_url('http://example.com')` |

### Our Validation Rules:

```php
// Score must be non-negative
if ($score < 0) {
    wp_send_json_error(['message' => 'Invalid score'], 400);
}

// Player name max 50 characters
if (strlen($player_name) > 50) {
    wp_send_json_error(['message' => 'Name too long'], 400);
}

// Player name not empty (after sanitization)
if (empty(trim($player_name))) {
    $player_name = 'Anonymous';
}
```

---

## 🧪 HOW TO TEST

### Step 1: Activate the Plugin

1. Go to: `http://wp-vector-game.test/wp-admin/`
2. Navigate to: **Plugins → Installed Plugins**
3. Find **"Vector Game API"**
4. Click **"Activate"**

### Step 2: Play the Game

1. Visit: `http://wp-vector-game.test/`
2. Play until you get a Game Over
3. When prompted, enter a name (or leave as "Anonymous")
4. Click OK

### Step 3: Check Browser Console

Open DevTools (F12) and look for:

```
✓ Score submitted successfully! 
{
    score: 1250,
    player_name: "John",
    level: 3,
    timestamp: "2025-12-17 12:34:56"
}
```

### Step 4: Check Server Logs

**Windows (Laragon):**
```
F:\laragon\www\wp-vector-game\wp-content\debug.log
```

Look for:
```
Vector Game - Score Received: {"score":1250,"player_name":"John","level":3,"user_id":0,"timestamp":"2025-12-17 12:34:56"}
```

### Step 5: Check Network Tab

In DevTools → Network:
1. Look for request to `admin-ajax.php`
2. Check **Request Payload:**
   ```
   action: vg_submit_score
   nonce: abc123def456
   score: 1250
   player_name: John
   level: 3
   ```
3. Check **Response:**
   ```json
   {
       "success": true,
       "data": {
           "message": "Score received successfully!",
           "data": {
               "score": 1250,
               "player_name": "John",
               "level": 3
           }
       }
   }
   ```

---

## ✅ PHASE 2 COMPLETION CHECKLIST

- [x] WordPress plugin created (`vector-game-api`)
- [x] AJAX action registered (`vg_submit_score`)
- [x] Nonce security implemented
- [x] Data sanitization implemented (`absint`, `sanitize_text_field`)
- [x] Data validation implemented (score >= 0, name <= 50 chars)
- [x] JavaScript updated to send score via AJAX
- [x] Player name prompt added
- [x] Success/error handling in JavaScript
- [x] User feedback (console logs, UI messages)
- [x] Scores received by backend (logged, not stored)

---

## 🚫 CURRENT LIMITATIONS (BY DESIGN - PHASE 2)

- ❌ **Scores NOT saved to database** - They're received and logged, but not persisted
- ❌ **No leaderboard yet** - Can't retrieve or display scores
- ❌ **No score history** - Each submission is independent

**These will be fixed in Phase 3!**

---

## 🔍 TROUBLESHOOTING

### Problem: "vectorGameAjax is not defined"

**Cause:** Plugin not activated or script handle mismatch

**Fix:**
1. Check plugin is activated in WordPress admin
2. Verify script handle in `functions.php` is `'vector-game-script'`
3. Hard refresh page (Ctrl+F5)

### Problem: "Security check failed"

**Cause:** Nonce expired or invalid

**Fix:**
1. Refresh the page (nonces expire after 12-24 hours)
2. Clear browser cache
3. Check `wp_create_nonce` and `wp_verify_nonce` use same action name

### Problem: "Failed to submit score"

**Cause:** Server error or validation failure

**Fix:**
1. Check browser console for error message
2. Check server error log (`wp-content/debug.log`)
3. Verify WordPress debug mode is enabled:
   ```php
   // In wp-config.php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   ```

### Problem: "Network error"

**Cause:** AJAX URL incorrect or server not responding

**Fix:**
1. Check `vectorGameAjax.ajaxurl` in console
2. Should be: `http://wp-vector-game.test/wp-admin/admin-ajax.php`
3. Test URL directly in browser

---

## 📚 KEY CONCEPTS LEARNED

### 1. WordPress Plugin Architecture
- Plugin header comments
- Activation/deactivation hooks
- Class-based organization

### 2. WordPress AJAX System
- `admin-ajax.php` endpoint
- Action hooks (`wp_ajax_`, `wp_ajax_nopriv_`)
- `wp_send_json_success()` and `wp_send_json_error()`

### 3. WordPress Security
- Nonces (number used once)
- `wp_create_nonce()` and `wp_verify_nonce()`
- Data sanitization functions

### 4. Data Handling
- Sanitization vs. Validation
- WordPress sanitization functions
- HTTP status codes (200, 400, 403)

### 5. JavaScript Integration
- `wp_localize_script()` for passing PHP data to JS
- Fetch API for AJAX requests
- URLSearchParams for POST data

---

## 🎓 WORDPRESS FUNCTIONS USED

| Function | Purpose |
|----------|---------|
| `add_action()` | Hook into WordPress events |
| `wp_enqueue_scripts` | Action hook for loading scripts |
| `wp_localize_script()` | Pass PHP data to JavaScript |
| `admin_url()` | Get URL to admin area |
| `wp_create_nonce()` | Generate security token |
| `wp_verify_nonce()` | Validate security token |
| `absint()` | Sanitize as absolute integer |
| `sanitize_text_field()` | Sanitize text input |
| `get_current_user_id()` | Get logged-in user ID (0 if guest) |
| `current_time()` | Get current WordPress time |
| `wp_send_json_success()` | Send JSON success response |
| `wp_send_json_error()` | Send JSON error response |
| `error_log()` | Log to debug.log |

---

## 📊 WHAT'S NEXT? (PHASE 3)

Phase 3 will add:
- **Database table** for storing scores
- **CREATE** scores (save to database)
- **READ** scores (retrieve leaderboard)
- **UPDATE** scores (if needed)
- **DELETE** scores (admin function)

This is the **CRUD** (Create, Read, Update, Delete) operations!

---

## 🎮 READY TO TEST!

1. **Activate the plugin** in WordPress admin
2. **Play the game** at `http://wp-vector-game.test/`
3. **Check browser console** for AJAX logs
4. **Check server logs** for received scores

Your game now talks to WordPress! 🚀

Next up: **Phase 3 - Database Storage & Leaderboard**

