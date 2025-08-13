<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package sendbypass
 */

get_header();
?>

	<main id="primary" class="px-16 site-main">

		<section class="container p-24 mx-auto my-16 lg:my-24 lg:p-40 error-404 not-found bg-surface-container-lowest rounded-medium lg:h-[498px] lg:flex lg:justify-center lg:items-center">
			<div>
				<header class="page-header">
					<h1 class="text-center text-display-large text-on-surface"><?php esc_html_e( '404', 'sendbypass' ); ?></h1>
				</header><!-- .page-header -->

				<div class="page-content">
					<div class="my-24">
						<h2 class="mb-4 text-center text-title-large text-on-surface"><?php esc_html_e( 'Oops! Looks like we missed the destination.', 'sendbypass' ); ?></h2>
						<p class="text-center text-body-medium text-on-surface-variant">The page you’re looking for seems to have taken a wrong turn on its global journey.</p>
					</div>
					<div class="flex flex-col lg:flex-row lg:justify-center lg:gap-12">
						<a href="/blog" class="bg-[#65558F]/[0.08] text-primary rounded-small mb-12 text-center py-12 lg:w-[131px] lg:mb-0">Return Home</a>
						<a href="https://sendbypass.com/search/send" class="py-12 text-center text-surface-container-lowest bg-primary rounded-small lg:w-[131px]">Connect hub</a>
					</div>

				</div><!-- .page-content -->
			</div>
		</section><!-- .error-404 -->

	</main><!-- #main -->

<?php
get_footer();
