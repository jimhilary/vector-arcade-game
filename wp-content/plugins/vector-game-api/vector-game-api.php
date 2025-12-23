<?php
/**
 * Plugin Name: Vector Game API
 * Plugin URI: http://wp-vector-game.test
 * Description: Backend API for the Vector Arcade Game - handles score submission and leaderboard
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: http://wp-vector-game.test
 * License: GPL v2 or later
 * Text Domain: vector-game-api
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Vector Game API Class
 */
class Vector_Game_API {
    
    /**
     * Database table name (without prefix)
     */
    private $table_name = 'vector_game_scores';
    
    /**
     * Constructor
     */
    public function __construct() {
        // Register AJAX actions for score submission
        add_action('wp_ajax_vg_submit_score', array($this, 'submit_score'));
        add_action('wp_ajax_nopriv_vg_submit_score', array($this, 'submit_score'));
        
        // Register AJAX actions for getting leaderboard
        add_action('wp_ajax_vg_get_leaderboard', array($this, 'ajax_get_leaderboard'));
        add_action('wp_ajax_nopriv_vg_get_leaderboard', array($this, 'ajax_get_leaderboard'));
        
        // Register AJAX actions for getting latest scores
        add_action('wp_ajax_vg_get_latest', array($this, 'ajax_get_latest'));
        add_action('wp_ajax_nopriv_vg_get_latest', array($this, 'ajax_get_latest'));
        
        // Enqueue scripts with nonce (priority 20 = runs AFTER theme's enqueue)
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'), 20);
    }
    
    /**
     * Get full table name with WordPress prefix
     * 
     * @return string Full table name
     */
    private function get_table_name() {
        global $wpdb;
        return $wpdb->prefix . $this->table_name;
    }
    
    /**
     * Enqueue scripts and localize with AJAX URL and nonce
     */
    public function enqueue_scripts() {
        // Only enqueue on the game page (check if our theme is active)
        if (get_template() === 'vector-game') {
            // Check if script is already enqueued by theme (it should be)
            // If not, enqueue it ourselves as fallback
            if (!wp_script_is('vector-game-script', 'enqueued')) {
                wp_enqueue_script(
                    'vector-game-script',
                    get_template_directory_uri() . '/game.js',
                    array(),
                    '1.0',
                    true // Load in footer
                );
            }
            
            // Localize script with AJAX data (runs after theme enqueues, so handle exists)
            wp_localize_script('vector-game-script', 'vectorGameAjax', array(
                'ajaxurl' => admin_url('admin-ajax.php'),
                'nonce'   => wp_create_nonce('vg_submit_score_nonce'),
            ));
        }
    }
    
    /**
     * AJAX handler for score submission
     */
    public function submit_score() {
        // Verify nonce for security
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'vg_submit_score_nonce')) {
            wp_send_json_error(array(
                'message' => 'Security check failed. Please refresh the page and try again.'
            ), 403);
        }
        
        // Get and sanitize input data
        $score = isset($_POST['score']) ? absint($_POST['score']) : 0;
        $player_name = isset($_POST['player_name']) ? sanitize_text_field($_POST['player_name']) : 'Anonymous';
        $level = isset($_POST['level']) ? absint($_POST['level']) : 1;
        
        // Validate score (must be positive)
        if ($score < 0) {
            wp_send_json_error(array(
                'message' => 'Invalid score value.'
            ), 400);
        }
        
        // Validate player name (max 50 characters)
        if (strlen($player_name) > 50) {
            wp_send_json_error(array(
                'message' => 'Player name is too long (max 50 characters).'
            ), 400);
        }
        
        // Validate player name (not empty after sanitization)
        if (empty(trim($player_name))) {
            $player_name = 'Anonymous';
        }
        
        // Get user ID if logged in (0 for guests)
        $user_id = get_current_user_id();
        
        // ===== PHASE 3: SAVE TO DATABASE =====
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
        
        // Check if insert was successful
        if ($inserted === false) {
            error_log('Vector Game - Database Error: ' . $wpdb->last_error);
            wp_send_json_error(array(
                'message' => 'Failed to save score. Please try again.'
            ), 500);
        }
        
        // Get the inserted ID
        $score_id = $wpdb->insert_id;
        
        // Log success (for debugging)
        error_log('Vector Game - Score Saved: ID=' . $score_id . ', Score=' . $score . ', Player=' . $player_name);
        
        // Send success response
        wp_send_json_success(array(
            'message' => 'Score saved successfully!',
            'data' => array(
                'id'          => $score_id,
                'score'       => $score,
                'player_name' => $player_name,
                'level'       => $level,
                'timestamp'   => current_time('mysql')
            )
        ), 200);
    }
    
    /**
     * Get top scores (leaderboard)
     * 
     * @param int $limit Number of scores to retrieve (default 10)
     * @return array Array of score objects
     */
    public function get_top_scores($limit = 10) {
        global $wpdb;
        
        $limit = absint($limit);
        if ($limit <= 0) {
            $limit = 10;
        }
        
        $sql = $wpdb->prepare(
            "SELECT * FROM {$this->get_table_name()} 
             ORDER BY score DESC, created_at ASC 
             LIMIT %d",
            $limit
        );
        
        return $wpdb->get_results($sql);
    }
    
    /**
     * Get latest scores
     * 
     * @param int $limit Number of scores to retrieve (default 10)
     * @return array Array of score objects
     */
    public function get_latest_scores($limit = 10) {
        global $wpdb;
        
        $limit = absint($limit);
        if ($limit <= 0) {
            $limit = 10;
        }
        
        $sql = $wpdb->prepare(
            "SELECT * FROM {$this->get_table_name()} 
             ORDER BY created_at DESC 
             LIMIT %d",
            $limit
        );
        
        return $wpdb->get_results($sql);
    }
    
    /**
     * Get total number of scores in database
     * 
     * @return int Total count
     */
    public function get_total_scores() {
        global $wpdb;
        
        return (int) $wpdb->get_var(
            "SELECT COUNT(*) FROM {$this->get_table_name()}"
        );
    }
    
    /**
     * Get player's best score
     * 
     * @param string $player_name Player name to search for
     * @return object|null Score object or null if not found
     */
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
    
    /**
     * AJAX handler for getting leaderboard (top scores)
     */
    public function ajax_get_leaderboard() {
        $limit = isset($_GET['limit']) ? absint($_GET['limit']) : 10;
        
        if ($limit > 100) {
            $limit = 100; // Max 100 scores
        }
        
        $scores = $this->get_top_scores($limit);
        
        wp_send_json_success(array(
            'scores' => $scores,
            'total'  => $this->get_total_scores()
        ));
    }
    
    /**
     * AJAX handler for getting latest scores
     */
    public function ajax_get_latest() {
        $limit = isset($_GET['limit']) ? absint($_GET['limit']) : 10;
        
        if ($limit > 100) {
            $limit = 100; // Max 100 scores
        }
        
        $scores = $this->get_latest_scores($limit);
        
        wp_send_json_success(array(
            'scores' => $scores,
            'total'  => $this->get_total_scores()
        ));
    }
}

/**
 * Create database table on plugin activation
 */
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
    
    // Log activation
    error_log('Vector Game API - Database table created: ' . $table_name);
}

// Register activation hook
register_activation_hook(__FILE__, 'vg_api_activate');

// Initialize the plugin
new Vector_Game_API();

