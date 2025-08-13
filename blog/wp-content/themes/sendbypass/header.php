<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package sendbypass
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">

	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div id="page" class="site">

<header class="h-[65px] lg:h-[80px] bg-surface-container py-8 px-16 flex items-center">
  <div class="container flex items-center justify-between mx-auto lg:px-16">
    <div class="flex items-center justify-between w-full md:gap-x-32 lg:justify-start">
      <a href="/blog">
        <img src="<?= get_template_directory_uri().'/src/image/logo.svg' ?>" alt="logo" class="w-[140px] h-[20px]" />
      </a>
     <?php if(wp_is_mobile()) : ?>
        <i class="icon-hamburger-menu text-[24px] px-[15px] py-4"></i>
        <i class="icon-close-remove text-[24px] !hidden px-[15px] py-4"></i>
      <?php endif; ?>
      <nav class="main-navigation lg:block <?= wp_is_mobile() ? 'mobile': 'desktop'?>">
        <?php
        wp_nav_menu(
          array(
            'theme_location' => 'menu-1',
            'menu_id'        => 'primary-menu',
            'container' => 'ul'
          )
        );
        ?>
        <?php if(wp_is_mobile()): ?>
          <div>
            <a href="<?php echo esc_url('https://sendbypass.com/'); ?>" class="text-title-medium text-center px-24 text-primary py-[10px] bg-[#65558F]/[0.08] rounded-small whitespace-nowrap block mb-40">
              Back to Sendbypass.com
            </a>
            <div>
              <span class="block mb-6 text-center text-body-medium text-on-surface">Follow us</span>
              <ul class="flex justify-center mb-0">
                <li><a href="https://x.com/sendbypass_co" class="flex items-center justify-center p-8"><i class="icon-x-com text-[24px] text-primary"></i></a></li>
                <li><a href="https://www.facebook.com/share/1ALJ919RC2/" class="flex items-center justify-center p-8"><i class="icon-facebook-circle text-[24px] text-primary"></i></a></li>
                <li><a href="https://www.instagram.com/sendbypass?igsh=MWpyNDB3enBmaWFtcA==" class="flex items-center justify-center p-8"><i class="icon-instagram text-[24px] text-primary"></i></a></li>
                <!-- <li><a href="" class="flex items-center justify-center p-8"><i class="icon-telegram-circle text-[24px] text-primary"></i></a></li> -->
                <li><a href="https://www.linkedin.com/company/sendbypass" class="flex items-center justify-center p-8"><i class="icon-linkedin-square text-[24px] text-primary"></i></a></li>
              </ul>
            </div>
          </div>
        <?php endif; ?>
      </nav><!-- #site-navigation -->
    </div>
    <a href="<?php echo esc_url('https://sendbypass.com/'); ?>" class="px-24 text-primary py-[10px] bg-[#65558F]/[0.08] rounded-small whitespace-nowrap <?= wp_is_mobile() ? 'hidden' : 'block' ?>">Back to Sendbypass.com</a>
  </div>
</header>
