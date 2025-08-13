<?php
/**
 * sendbypass functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package sendbypass
 */

if ( ! defined( '_S_VERSION' ) ) {
	// Replace the version number of the theme on each release.
	define( '_S_VERSION', '1.0.0' );
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function sendbypass_setup() {
	/*
		* Make theme available for translation.
		* Translations can be filed in the /languages/ directory.
		* If you're building a theme based on sendbypass, use a find and replace
		* to change 'sendbypass' to the name of your theme in all the template files.
		*/
	load_theme_textdomain( 'sendbypass', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
		* Let WordPress manage the document title.
		* By adding theme support, we declare that this theme does not use a
		* hard-coded <title> tag in the document head, and expect WordPress to
		* provide it for us.
		*/
	add_theme_support( 'title-tag' );

	/*
		* Enable support for Post Thumbnails on posts and pages.
		*
		* @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		*/
	add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus(
		array(
			'menu-1' => esc_html__( 'Primary', 'sendbypass' ),
		)
	);

	/*
		* Switch default core markup for search form, comment form, and comments
		* to output valid HTML5.
		*/
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);

	// Set up the WordPress core custom background feature.
	add_theme_support(
		'custom-background',
		apply_filters(
			'sendbypass_custom_background_args',
			array(
				'default-color' => 'ffffff',
				'default-image' => '',
			)
		)
	);

	// Add theme support for selective refresh for widgets.
	add_theme_support( 'customize-selective-refresh-widgets' );

	/**
	 * Add support for core custom logo.
	 *
	 * @link https://codex.wordpress.org/Theme_Logo
	 */
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 250,
			'width'       => 250,
			'flex-width'  => true,
			'flex-height' => true,
		)
	);
}
add_action( 'after_setup_theme', 'sendbypass_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function sendbypass_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'sendbypass_content_width', 640 );
}
add_action( 'after_setup_theme', 'sendbypass_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function sendbypass_widgets_init() {
	register_sidebar(
		array(
			'name'          => esc_html__( 'Sidebar', 'sendbypass' ),
			'id'            => 'sidebar-1',
			'description'   => esc_html__( 'Add widgets here.', 'sendbypass' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);
}
add_action( 'widgets_init', 'sendbypass_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function sendbypass_scripts() {
	//Using Current Time
	$version = time();
	wp_enqueue_style(
        'sendbypass-style', 
        get_template_directory_uri() . '/dist/style.css',
        array(),
        $version
    );
    
    wp_enqueue_script(
        'sendbypass-script', 
        get_template_directory_uri() . '/dist/bundle.js',
        array(),
        $version,
        true
    );
	
	wp_enqueue_style( 'my-font', get_template_directory_uri() . '/src/iconly.min.css' , [] , filemtime(get_template_directory() . '/src/iconly.min.css'), false );
	

	// if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
	// 	wp_enqueue_script( 'comment-reply' );
	// }
}
add_action( 'wp_enqueue_scripts', 'sendbypass_scripts' );

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require get_template_directory() . '/inc/jetpack.php';
}

//Stops access to wordpress extra APIs for guest people
add_filter('rest_endpoints', function($endpoints){
	if (!is_user_logged_in()) {
		if (isset($endpoints['/wp/v2/users'])) {
			unset($endpoints['/wp/v2/users']);
		}
		if (isset($endpoints['/wp/v2/users/(?P<id>[\d]+)'])) {
			unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);
		}
		if (isset($endpoints['/wp/v2/posts'])) {
			unset($endpoints['/wp/v2/posts']);
		}
		if (isset($endpoints['/wp/v2/posts/(?P<id>[\d]+)'])) {
			unset($endpoints['/wp/v2/posts/(?P<id>[\d]+)']);
		}
		if (isset($endpoints['/wp/v2/pages'])) {
			unset($endpoints['/wp/v2/pages']);
		}
		if (isset($endpoints['/wp/v2/pages/(?P<id>[\d]+)'])) {
			unset($endpoints['/wp/v2/pages/(?P<id>[\d]+)']);
		}
	}
	return $endpoints;
});

//sort users by register-date by default in users list and in admin area
add_action( 'pre_get_users', function( $user_query ) {
    global $pagenow;
    if ( is_admin() && $pagenow == 'users.php' ) :
        $user_query->query_vars['orderby'] = 'user_registered';
        $user_query->query_vars['order'] = 'DESC';
    endif;
} );

/**
 * Generate table of contents and add IDs to headings
 */
function generate_table_of_contents($content) {
    // Find all h2 and h3 headings
    $pattern = '/<h([23])[^>]*>(.*?)<\/h[23]>/i';
    
    if (!preg_match_all($pattern, $content, $matches, PREG_SET_ORDER)) {
        return ['toc' => '', 'content' => $content];
    }

    // Start TOC HTML
    $toc = '<div class="' . (wp_is_mobile() ? 'bg-surface-container-high w-full p-16 pt-20 rounded-s-large rounded-e-large' : 'lg:pb-8 lg:pt-24 lg:px-8 lg:mb-24') . '">';
    $toc .= '<div class="w-32 h-4 mx-auto mb-20 rounded-small lg:hidden bg-outline"></div>';
    $toc .= wp_is_mobile() ? '<div><i class="icon-close-remove text-[20px] text-outline top-[10px] right-[10px] absolute"></i></div>' : '';
	
	$toc .= '<span class="block px-8 mb-12 lg:px-0 text-title-medium text-on-surface">Table of contents</span>';
    $toc .= '<ul class="px-8 m-0 lg:p-0">';

    // Track used anchors
    $used_anchors = [];
    
    // Modified content with IDs
    $modified_content = $content;

    foreach ($matches as $heading) {
        $level = $heading[1];  // 2 or 3
        $title = strip_tags($heading[2]);
        $anchor = sanitize_title($title);

        // Handle duplicate anchors
        if (isset($used_anchors[$anchor])) {
            $used_anchors[$anchor]++;
            $anchor .= '-' . $used_anchors[$anchor];
        } else {
            $used_anchors[$anchor] = 1;
        }

        // Add indent for h3
        $indent = ($level == 3) ? ' style="margin-left:15px;"' : '';
		
		$textSizeClass = ($level == 3) ? 'text-body-small' : 'text-body-medium';
        // Add TOC item
		$toc .= sprintf(
            '<li class="flex items-center justify-start mb-8 group gap-x-8"%s>
                <span class="w-[5px] h-[5px] bg-outline-variant rounded-full group-hover:bg-primary transition-colors flex-shrink-0"></span>
                <a href="#%s" class="transition-colors %s text-on-surface group-hover:text-primary">%s</a>
            </li>',
            $indent,
            esc_attr($anchor),
            $textSizeClass,
            esc_html($title)
        );

        // Replace heading in content with ID-added version
        $replacement = sprintf('<h%s id="%s">%s</h%s>', 
            $level,
            esc_attr($anchor),
            $heading[2],
            $level
        );
        $modified_content = str_replace($heading[0], $replacement, $modified_content);
    }

    $toc .= '</ul></div>';

    return ['toc' => $toc, 'content' => $modified_content];
}

// Add this to your template where you want to display the post
add_filter('the_content', function($content) {
    if (is_single()) {
        $result = generate_table_of_contents($content);
        return $result['content'];
    }
    return $content;
}, 1);

function custom_excerpt_more($more) {
    return '';
}
add_filter('excerpt_more', 'custom_excerpt_more');

function add_title_as_caption_to_images( $content ) {
    // Use regex to locate img tags with a title attribute.
    $pattern = '/<img(.*?)title\s*=\s*"(.*?)"(.*?)\/?>/i';
    
    $content = preg_replace_callback( $pattern, function( $matches ) {
        // Extract the entire img tag, any attributes before the title, the title value, and any attributes after.
        $beforeTitle = $matches[1];
        $title = $matches[2];
        $afterTitle  = $matches[3];
        
        // Rebuild the original image tag
        $imgTag = '<img' . $beforeTitle . 'title="' . $title . '"' . $afterTitle . ' />';
        
        // Wrap in figure and add a figcaption that reflects the title attribute.
        return $imgTag . '<figcaption class="text-center wp-caption-text">' . esc_html( $title ) . '</figcaption></figure>';
    }, $content );

    return $content;
}
add_filter( 'the_content', 'add_title_as_caption_to_images' );



