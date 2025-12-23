# PHASE 3: Database Storage & Persistence

## ARCHITECTURE REMINDER

This never changes:

```
Browser (Frontend)
  ↓
Theme (HTML + Canvas + JS)      ← Phase 1: Game Logic
  ↓
WordPress AJAX / REST           ← Phase 2: API Layer
  ↓
MySQL Database                  ← Phase 3: Storage (YOU ARE HERE)
```

---

## 🎯 GOAL

Make scores **permanent**. Scores survive page refreshes, browser restarts, and server reboots.

---

## 📊 DATABASE TABLE DESIGN

### Table Name

```
wp_vector_game_scores
```

*Note: `wp_` is the WordPress table prefix (may vary)*

### Schema

```sql
CREATE TABLE wp_vector_game_scores (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    user_id bigint(20) DEFAULT NULL,
    player_name varchar(50) NOT NULL,
    score int(11) NOT NULL DEFAULT 0,
    level int(11) NOT NULL DEFAULT 1,
    created_at datetime NOT NULL,
    PRIMARY KEY (id),
    KEY user_id (user_id),
    KEY score (score),
    KEY created_at (created_at)
);
```

### Column Descriptions

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | bigint(20) | NO | Auto-incrementing primary key |
| `user_id` | bigint(20) | YES | WordPress user ID (NULL for guests) |
| `player_name` | varchar(50) | NO | Player's display name |
| `score` | int(11) | NO | Points earned (default 0) |
| `level` | int(11) | NO | Game level reached (default 1) |
| `created_at` | datetime | NO | When score was submitted |

### Indexes

- **PRIMARY KEY** on `id` - Fast lookups by ID
- **KEY** on `user_id` - Fast user score queries
- **KEY** on `score` - Fast leaderboard sorting
- **KEY** on `created_at` - Fast time-based queries

---

## 🔧 PLUGIN ACTIVATION

### What Happens on Activation?

When you click "Activate" in WordPress admin, the plugin runs a special function that:

1. Checks if table exists
2. Creates table if missing
3. Updates table if structure changed

### The Magic Function: `dbDelta()`

WordPress provides `dbDelta()` for safe database operations:

```php
function vg_api_activate() {
    global $wpdb;
    
    $table_name = $wpdb->prefix . 'vector_game_scores';
    $charset_collate = $wpdb->get_charset_collate();
    
    $sql = "CREATE TABLE $table_name (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        user_id bigint(20) DEFAULT NULL,
        player_name varchar(50) NOT NULL,
        score int(11) NOT NULL DEFAULT 0,
        level int(11) NOT NULL DEFAULT 1,
        created_at datetime NOT NULL,
        PRIMARY KEY  (id),
        KEY user_id (user_id),
        KEY score (score),
        KEY created_at (created_at)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}

register_activation_hook(__FILE__, 'vg_api_activate');
```

### Why `dbDelta()` Instead of Raw SQL?

- ✅ Safe: Won't error if table exists
- ✅ Smart: Updates structure if changed
- ✅ Portable: Works on any WordPress install
- ✅ WordPress Way: Official recommendation

---

## 💾 SAVING SCORES TO DATABASE

### The Insert Process

```php
public function submit_score() {
    // ... validation code ...
    
    global $wpdb;
    
    $inserted = $wpdb->insert(
        $this->get_table_name(),
        array(
            'user_id'     => $user_id > 0 ? $user_id : null,
            'player_name' => $player_name,
            'score'       => $score,
            'level'       => $level,
            'created_at'  => current_time('mysql')
        ),
        array(
            '%d', // user_id (integer or null)
            '%s', // player_name (string)
            '%d', // score (integer)
            '%d', // level (integer)
            '%s'  // created_at (datetime string)
        )
    );
    
    if ($inserted === false) {
        // Handle error
        wp_send_json_error(array(
            'message' => 'Failed to save score'
        ), 500);
    }
    
    $score_id = $wpdb->insert_id; // Get auto-generated ID
    
    wp_send_json_success(array(
        'id' => $score_id,
        'score' => $score
    ));
}
```

### Why Format Strings? (%d, %s)

WordPress uses **prepared statements** for security:

- `%d` = Integer (digit)
- `%s` = String
- `%f` = Float

This prevents **SQL injection** attacks!

### Example Attack (Without Preparation)

```php
// ❌ DANGEROUS - DON'T DO THIS!
$sql = "INSERT INTO scores (name) VALUES ('$player_name')";
// If player_name = "'; DROP TABLE scores; --"
// SQL becomes: INSERT INTO scores (name) VALUES (''); DROP TABLE scores; --')
```

### Safe Version (With Preparation)

```php
// ✅ SAFE - WordPress handles escaping
$wpdb->insert($table, array('name' => $player_name), array('%s'));
```

---

## 🔍 QUERYING THE DATABASE

### 1. Top Scores (Leaderboard)

```php
public function get_top_scores($limit = 10) {
    global $wpdb;
    
    $sql = $wpdb->prepare(
        "SELECT * FROM {$this->get_table_name()} 
         ORDER BY score DESC, created_at ASC 
         LIMIT %d",
        $limit
    );
    
    return $wpdb->get_results($sql);
}
```

**How it works:**
1. `ORDER BY score DESC` - Highest scores first
2. `created_at ASC` - If tied, earliest wins
3. `LIMIT %d` - Only return X results
4. `$wpdb->prepare()` - Escape the limit value

### 2. Latest Scores

```php
public function get_latest_scores($limit = 10) {
    global $wpdb;
    
    $sql = $wpdb->prepare(
        "SELECT * FROM {$this->get_table_name()} 
         ORDER BY created_at DESC 
         LIMIT %d",
        $limit
    );
    
    return $wpdb->get_results($sql);
}
```

**How it works:**
- `ORDER BY created_at DESC` - Newest first

### 3. Total Score Count

```php
public function get_total_scores() {
    global $wpdb;
    
    return (int) $wpdb->get_var(
        "SELECT COUNT(*) FROM {$this->get_table_name()}"
    );
}
```

**How it works:**
- `COUNT(*)` - Count all rows
- `get_var()` - Get single value (not array)

### 4. Player's Best Score

```php
public function get_player_best_score($player_name) {
    global $wpdb;
    
    return $wpdb->get_row(
        $wpdb->prepare(
            "SELECT * FROM {$this->get_table_name()} 
             WHERE player_name = %s 
             ORDER BY score DESC 
             LIMIT 1",
            $player_name
        )
    );
}
```

**How it works:**
- `WHERE player_name = %s` - Filter by name
- `ORDER BY score DESC` - Highest first
- `LIMIT 1` - Just the best one

---

## 🌐 AJAX ENDPOINTS FOR LEADERBOARD

### 1. Get Leaderboard Endpoint

**URL:** `wp-admin/admin-ajax.php?action=vg_get_leaderboard&limit=10`

**Request:**
```javascript
fetch(ajaxurl + '?action=vg_get_leaderboard&limit=10')
    .then(response => response.json())
    .then(data => {
        console.log(data.data.scores);
        console.log('Total scores:', data.data.total);
    });
```

**Response:**
```json
{
    "success": true,
    "data": {
        "scores": [
            {
                "id": "15",
                "user_id": null,
                "player_name": "John",
                "score": "5000",
                "level": "5",
                "created_at": "2025-12-17 14:30:00"
            },
            {
                "id": "12",
                "user_id": "1",
                "player_name": "Admin",
                "score": "4500",
                "level": "4",
                "created_at": "2025-12-17 13:15:00"
            }
        ],
        "total": 25
    }
}
```

### 2. Get Latest Scores Endpoint

**URL:** `wp-admin/admin-ajax.php?action=vg_get_latest&limit=10`

**Same format, but sorted by time instead of score**

---

## 🛠️ WORDPRESS DATABASE OBJECT (`$wpdb`)

### What is `$wpdb`?

Global object that handles all database operations in WordPress.

### Key Methods

| Method | Purpose | Example |
|--------|---------|---------|
| `$wpdb->insert()` | Insert row | `$wpdb->insert($table, $data, $format)` |
| `$wpdb->update()` | Update row | `$wpdb->update($table, $data, $where, $format)` |
| `$wpdb->delete()` | Delete row | `$wpdb->delete($table, $where, $where_format)` |
| `$wpdb->get_results()` | Get multiple rows | `$wpdb->get_results($sql)` |
| `$wpdb->get_row()` | Get single row | `$wpdb->get_row($sql)` |
| `$wpdb->get_var()` | Get single value | `$wpdb->get_var($sql)` |
| `$wpdb->prepare()` | Prepare SQL safely | `$wpdb->prepare($sql, $value1, $value2)` |

### Table Prefix

```php
$wpdb->prefix // Usually 'wp_' but can be customized
```

### Last Insert ID

```php
$wpdb->insert_id // Auto-increment ID of last insert
```

### Error Handling

```php
if ($wpdb->insert(...) === false) {
    error_log($wpdb->last_error); // Log the error
}
```

---

## 🧪 TESTING PHASE 3

### Step 1: Deactivate & Reactivate Plugin

1. Go to: `http://wp-vector-game.test/wp-admin/plugins.php`
2. Click **"Deactivate"** on Vector Game API
3. Click **"Activate"** again

**Why?** Runs the activation hook to create the table.

### Step 2: Check Database

**Option A: phpMyAdmin**
1. Go to: `http://localhost/phpmyadmin/`
2. Select database (left sidebar)
3. Look for `wp_vector_game_scores` table
4. Click to see structure

**Option B: SQL Query**
```sql
DESCRIBE wp_vector_game_scores;
```

### Step 3: Play the Game

1. Visit: `http://wp-vector-game.test/`
2. Play until Game Over
3. Enter a name
4. Check browser console for: `✓ Score saved to database! {id: 1, ...}`

### Step 4: Verify in Database

**phpMyAdmin:**
1. Click `wp_vector_game_scores` table
2. Click **"Browse"** tab
3. See your score!

**SQL Query:**
```sql
SELECT * FROM wp_vector_game_scores ORDER BY id DESC LIMIT 10;
```

### Step 5: Test Persistence

1. Refresh the page (F5)
2. Close the browser completely
3. Restart your computer
4. Open browser again
5. Check database - **scores are still there!** 🎉

### Step 6: Test Leaderboard API

**Browser Console:**
```javascript
fetch('http://wp-vector-game.test/wp-admin/admin-ajax.php?action=vg_get_leaderboard&limit=5')
    .then(r => r.json())
    .then(d => console.table(d.data.scores));
```

You should see a table with the top 5 scores!

---

## 🔐 DATABASE SECURITY BEST PRACTICES

### 1. Always Use Prepared Statements

```php
// ✅ GOOD
$wpdb->prepare("SELECT * FROM table WHERE id = %d", $id);

// ❌ BAD
"SELECT * FROM table WHERE id = $id"
```

### 2. Validate Before Inserting

```php
if ($score < 0) {
    return; // Don't save negative scores
}
```

### 3. Sanitize User Input

```php
$player_name = sanitize_text_field($_POST['player_name']);
```

### 4. Use Indexes

```sql
KEY score (score)  -- Faster ORDER BY score
```

### 5. Limit Query Results

```php
$wpdb->prepare("... LIMIT %d", $limit); // Don't return 1 million rows!
```

---

## ✅ PHASE 3 COMPLETION CHECKLIST

- [x] Database table created with proper schema
- [x] Activation hook registered
- [x] `dbDelta()` used for safe table creation
- [x] Score saving implemented with `$wpdb->insert()`
- [x] Prepared statements used (SQL injection protection)
- [x] Query functions created:
  - [x] Get top scores
  - [x] Get latest scores
  - [x] Get total count
  - [x] Get player best score
- [x] AJAX endpoints for leaderboard
- [x] Error handling for database failures
- [x] Indexes added for performance
- [x] Scores persist across refreshes

---

## 🚫 CURRENT LIMITATIONS (PHASE 3)

- ❌ **No visual leaderboard** - Data exists but not displayed in game
- ❌ **No admin panel** - Can't manage scores from WordPress admin
- ❌ **No delete function** - Can't remove bad scores

**These will be addressed in Phase 4!**

---

## 🔍 TROUBLESHOOTING

### Problem: Table not created

**Check:**
```sql
SHOW TABLES LIKE '%vector_game%';
```

**Fix:**
1. Deactivate plugin
2. Check `wp-content/debug.log` for errors
3. Enable WP_DEBUG in `wp-config.php`
4. Reactivate plugin

### Problem: "Failed to save score"

**Check Browser Console:**
- Look for error message
- Check network tab for 500 error

**Check Server Log:**
```
wp-content/debug.log
```

**Common causes:**
- Database permissions
- Table doesn't exist
- Validation failure

### Problem: "Database Error"

**Check:**
```php
error_log($wpdb->last_error);
```

**Common errors:**
- Table doesn't exist → Reactivate plugin
- Column mismatch → Deactivate, delete table, reactivate
- Permission denied → Check MySQL user permissions

### Problem: Duplicate scores

**Check:**
```sql
SELECT player_name, score, COUNT(*) as count 
FROM wp_vector_game_scores 
GROUP BY player_name, score 
HAVING count > 1;
```

**Fix:** This is actually OK! Players can submit multiple times.

---

## 📚 KEY CONCEPTS LEARNED

### 1. WordPress Database Layer
- `$wpdb` global object
- Table prefix handling
- Prepared statements

### 2. Plugin Activation Hooks
- `register_activation_hook()`
- `dbDelta()` for safe schema updates
- `require_once` for WordPress functions

### 3. SQL Operations
- CREATE TABLE
- INSERT INTO
- SELECT with ORDER BY and LIMIT
- Indexes for performance

### 4. Data Types & Formats
- `bigint` for IDs
- `varchar` for strings
- `int` for numbers
- `datetime` for timestamps
- `NULL` for optional values

### 5. WordPress Functions
- `$wpdb->insert()` - Safe inserts
- `$wpdb->get_results()` - Multiple rows
- `$wpdb->get_row()` - Single row
- `$wpdb->get_var()` - Single value
- `$wpdb->prepare()` - SQL injection protection
- `current_time('mysql')` - WordPress timezone-aware time

---

## 🎓 SQL QUERIES CHEATSHEET

### View All Scores
```sql
SELECT * FROM wp_vector_game_scores ORDER BY created_at DESC;
```

### Top 10 Leaderboard
```sql
SELECT * FROM wp_vector_game_scores 
ORDER BY score DESC 
LIMIT 10;
```

### Scores by Player
```sql
SELECT * FROM wp_vector_game_scores 
WHERE player_name = 'John' 
ORDER BY score DESC;
```

### Count Total Scores
```sql
SELECT COUNT(*) as total FROM wp_vector_game_scores;
```

### Average Score
```sql
SELECT AVG(score) as average FROM wp_vector_game_scores;
```

### Highest Score Ever
```sql
SELECT MAX(score) as highest FROM wp_vector_game_scores;
```

### Scores Today
```sql
SELECT * FROM wp_vector_game_scores 
WHERE DATE(created_at) = CURDATE();
```

### Delete All Scores (CAREFUL!)
```sql
DELETE FROM wp_vector_game_scores;
```

### Delete Single Score
```sql
DELETE FROM wp_vector_game_scores WHERE id = 123;
```

---

## 📊 DATABASE PERFORMANCE TIPS

### 1. Use Indexes
Already done! We have indexes on `score` and `created_at`.

### 2. Limit Results
```php
LIMIT 10 // Don't fetch all scores
```

### 3. Only Select Needed Columns
```sql
SELECT id, player_name, score -- Don't use SELECT *
FROM wp_vector_game_scores;
```

### 4. Use COUNT(*) for Totals
```php
$total = $wpdb->get_var("SELECT COUNT(*) ...");
```
Don't fetch all rows and count in PHP!

### 5. Cache Results (Advanced)
```php
$scores = wp_cache_get('top_scores');
if ($scores === false) {
    $scores = $wpdb->get_results(...);
    wp_cache_set('top_scores', $scores, '', 300); // Cache 5 minutes
}
```

---

## 🎉 CONGRATULATIONS!

Your scores are now **permanent**! 

### What You've Built:
- ✅ Custom database table
- ✅ Safe activation system
- ✅ Persistent score storage
- ✅ Query API for leaderboards
- ✅ Professional WordPress integration

### Test It:
1. Play the game
2. Submit a score
3. **Refresh the page**
4. Check phpMyAdmin
5. **Score is still there!** 🎊

---

## 🚀 WHAT'S NEXT? (PHASE 4)

Phase 4 will add:
- **Visual Leaderboard** in the game UI
- **Admin Panel** for score management
- **User Profiles** showing player history
- **Filters** (daily, weekly, all-time)
- **Pagination** for long lists
- **Delete/Edit** capabilities for admins

**Your game now has a persistent memory!** 🧠💾

