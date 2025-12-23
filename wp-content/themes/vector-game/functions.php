<?php
/**
 * Theme Functions
 * 
 * WHY THIS FILE?
 * functions.php is WordPress's "control center" for your theme.
 * It runs on EVERY page load and lets you:
 * - Load CSS/JS files
 * - Register features
 * - Add custom code
 */

// Prevent direct access (security best practice)
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Enqueue (load) theme styles and scripts
 * 
 * WHY A FUNCTION?
 * We wrap our code in a function and "hook" it to WordPress.
 * This is WordPress's event system - like addEventListener in JavaScript!
 */
function vector_game_enqueue_assets() {
    
    /* 
     * Load style.css
     * 
     * wp_enqueue_style() tells WordPress: "Hey, load this CSS file!"
     * 
     * Parameters:
     * 1. 'vector-game-style' = unique handle (like an ID)
     * 2. get_stylesheet_uri() = path to style.css
     * 3. array() = dependencies (none for us)
     * 4. '1.0' = version number (for cache busting)
     */
    wp_enqueue_style( 
        'vector-game-style', 
        get_stylesheet_uri(), 
        array(), 
        '1.0' 
    );
    
    /* 
     * Load game.js
     * 
     * wp_enqueue_script() tells WordPress: "Hey, load this JavaScript file!"
     * 
     * Parameters:
     * 1. 'vector-game-js' = unique handle
     * 2. get_template_directory_uri() . '/game.js' = path to our JS file
     * 3. array() = dependencies (we don't need jQuery or anything)
     * 4. '1.0' = version number
     * 5. true = load in footer (IMPORTANT: better performance!)
     */
    wp_enqueue_script( 
        'vector-game-script', 
        get_template_directory_uri() . '/game.js', 
        array(), 
        '1.0', 
        true // Load in footer so DOM is ready
    );
    
    // 🎵 Pass theme URL to JavaScript for background music
    wp_localize_script('vector-game-script', 'vectorGameTheme', array(
        'themeUrl' => get_template_directory_uri(),
    ));
}

/* 
 * Hook our function to wp_enqueue_scripts
 * 
 * WHY?
 * This tells WordPress: "When you're loading scripts and styles, run my function!"
 * It's like saying: "WordPress, at the right moment, call vector_game_enqueue_assets()"
 * 
 * Without this hook, WordPress will never run our function!
 */
add_action( 'wp_enqueue_scripts', 'vector_game_enqueue_assets' );

/**
 * Theme setup
 * 
 * This function registers theme features and support.
 */
function vector_game_setup() {
    
    /*
     * Let WordPress manage the <title> tag
     * Without this, the <title> won't update properly
     */
    add_theme_support( 'title-tag' );
    
    /*
     * Enable HTML5 markup
     * Makes WordPress use modern HTML5 instead of old XHTML
     */
    add_theme_support( 'html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'script',
        'style',
    ) );
}

// Hook setup function to after_setup_theme
add_action( 'after_setup_theme', 'vector_game_setup' );

/**
 * Disable admin bar on frontend
 * 
 * WHY?
 * The admin bar at the top would cover our game UI.
 * This removes it for a clean fullscreen experience.
 */
add_filter( 'show_admin_bar', '__return_false' );

