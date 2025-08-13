<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package sendbypass
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class('container mx-auto mt-16 lg:mt-24 px-16 lg:px-0'); ?>>
	<header class="p-8 pb-16 mb-12 bg-surface-container-lowest lg:p-12 entry-header rounded-large">
		<div class="flex flex-col lg:gap-24 lg:flex-row">
			<div class="lg:w-[388px] lg:h-[208px] mb-8 lg:mb-0">
				<?php
					$thumbnail_url = get_the_post_thumbnail_url(get_the_ID(), 'full');
					if ($thumbnail_url) {
						echo '<img src="' . esc_url($thumbnail_url) . '"class="object-cover w-full h-full rounded-small" alt="' . get_the_title() . '">';
					}
				?>
			</div>
			<div class="px-4 pt-12 pb-8 lg:pt-0 lg:px-0 lg:pb-0">
				<div class="flex items-center justify-start h-16 mb-16 lg:mb-24 lg:mt-12">
					<?php
						$categories = get_the_category();
						if( !empty( $categories ) ) :
							$category_list = join( ', ', wp_list_pluck( $categories, 'name' ) ); 
							echo '<span class="truncate text-label-medium text-on-surface-variant">'. wp_kses_post( $category_list ). '</span>';
						endif; 
					?>
					<span class="block h-8 mx-24 border-l border-outline-variant"></span>
					<span class="truncate text-label-medium text-on-surface-variant"><?php echo get_the_date('M j, Y'); ?></span>
					<?php if(get_field('read_time')): ?>
						<span class="block h-8 mx-24 border-l border-outline-variant"></span>
						<span class="truncate text-label-medium text-on-surface-variant">
							<?php the_field('read_time') ?> min read time
						</span>
					<?php endif; ?>
				</div>
				<?php
					if ( is_singular() ) :
						the_title( '<h1 class="mb-8 lg:text-display-small text-title-large text-on-surface">', '</h1>' );
					else :
						the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
					endif; 
				?>
				 <ul class="breadcrumbs flex items-center justify-start h-[16px] lg:pl-4 lg:gap-x-8 mt-8 lg:mt-0">
					<li class="flex items-center justify-center text-on-surface-variant text-body-small"> 
						<a href="https://sendbypass.com" class="flex items-center justify-center hover:text-primary">Home <i class="icon-chevron-right-md text-[16px]"></i></a>
					</li>
					<li class="flex items-center justify-center text-on-surface-variant text-body-small">
						<a href="<?= home_url() ?>" class="flex items-center justify-center hover:text-primary">Blog <i class="icon-chevron-right-md text-[16px]"></i></a>
					</li>
					<li class="flex items-center justify-center min-w-0 text-on-surface-variant text-body-small">
						<span class="truncate">
							<?php the_title() ?>
						</span>
					</li>
				</ul>
			</div>
		</div>
	</header><!-- .entry-header -->
		
	<div class="flex flex-col p-8 lg:p-16 lg:flex-row entry-content rounded-large gap-x-32 <?= get_the_content() ? 'bg-surface-container-lowest' : ''?>">
		<div class="w-[284px] flex-shrink-0 order-2 lg:order-1 lg:sticky lg:top-0 lg:h-screen">
			<?php if (!wp_is_mobile()): ?>
					<?php   
						$toc_content = generate_table_of_contents(get_the_content());
						echo $toc_content['toc'];
					?>
				
					<div class="p-12 bg-primary-opacity-8 rounded-medium">
						<span class="block text-title-medium text-on-surface">Start Exploring</span>
							<ul class="p-0 m-0 lg:px-8 lg:my-12">
								<li class="flex items-center gap-4 mb-6">
									<i class="icon-check-circle text-primary text-[16px]"></i>
									<span class="text-body-medium text-on-surface">Earn money and travel for free</span>
								</li>
								<li class="flex items-center gap-4 mb-6">
									<i class="icon-check-circle text-primary text-[16px]"></i>
									<span class="text-body-medium text-on-surface">Buy everything from anywhere</span>
								</li>
								<li class="flex items-center gap-4 mb-6">
									<i class="icon-check-circle text-primary text-[16px]"></i>
									<span class="text-body-medium text-on-surface">Send your luggage quickly</span>
								</li>
							</ul>
						<a href="https://sendbypass.com/" class="block w-full px-24 py-[10px] text-center bg-primary rounded-small text-[#fff]">Get Started</a>
					</div>
				
			<?php endif; ?>
		</div>
		<div class="order-1 lg:order-2">
			<?php if( get_the_excerpt() ) : ?>
				<div class="p-16 bg-primary-opacity-8 rounded-medium">
					<span class="block mb-8 text-title-medium text-on-surface">Summary</span>
					<p class="text-on-surface text-body-medium lg:text-body-large">
						<?php echo wp_trim_words(get_the_excerpt(), 55, ''); ?>
					</p>
				</div>
			<?php endif; ?>
			<div class="px-12 mt-8 lg:px-0 wp-editor">
				<?php
					the_content();
				?>
				<div class="block w-full h-[1px] bg-surface-container-high mt-16 mb-4"></div>
				<div class="flex items-center gap-8 pt-8">
					<span class="text-label-large text-on-surface-variant">share</span> 
					<ul class="flex gap-4 p-0 m-0 social-media-icons">
						<li>
							<a href="https://x.com/intent/tweet?url=<?php echo urlencode(get_permalink()); ?>&text=<?php echo urlencode(get_the_title()); ?>" 
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center justify-center w-32 h-32">
								<i class="icon-x-com text-[20px] text-primary"></i>
							</a>
						</li>
						<li>
							<a href="https://www.facebook.com/sharer/sharer.php?u=<?php echo urlencode(get_permalink()); ?>" 
							target="_blank" 
							rel="noopener noreferrer"
							class="flex items-center justify-center w-32 h-32">
								<i class="icon-facebook-circle text-[20px] text-primary"></i>
							</a>
						</li>
						<li>
							<a href="https://t.me/share/url?url=<?php echo urlencode(get_permalink()); ?>&text=<?php echo urlencode(get_the_title()); ?>" 
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center justify-center w-32 h-32">
								<i class="icon-telegram-circle text-[20px] text-primary"></i>
							</a>
						</li>
						<li>
							<a href="https://www.linkedin.com/shareArticle?mini=true&url=<?php echo urlencode(get_permalink()); ?>&title=<?php echo urlencode(get_the_title()); ?>" 
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center justify-center w-32 h-32">
								<i class="icon-linkedin-square text-[20px] text-primary"></i>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<?php if(wp_is_mobile()) : ?>
		
			<div class="p-12 mt-12 mb-48 bg-primary-opacity-8 rounded-medium">
				<span class="block text-title-medium text-on-surface">Start Exploring</span>
				<ul class="p-0 my-12 lg:px-8 lg:my-12">
					<li class="flex items-center gap-4 mb-6">
						<i class="icon-check-circle text-primary text-[16px]"></i>
						<span class="text-body-medium text-on-surface">Earn money and travel for free</span>
					</li>
					<li class="flex items-center gap-4 mb-6">
						<i class="icon-check-circle text-primary text-[16px]"></i>
						<span class="text-body-medium text-on-surface">Buy everything from anywhere</span>
					</li>
					<li class="flex items-center gap-4 mb-6">
						<i class="icon-check-circle text-primary text-[16px]"></i>
						<span class="text-body-medium text-on-surface">Send your luggage quickly</span>
					</li>
				</ul>
				<a href="https://sendbypass.com/" class="block w-full px-24 py-[10px] text-center bg-primary rounded-small text-[#fff]">Get Started</a>
			</div>
		
	<?php endif ?>

</article>
<?php 
	// Get the current post's categories
	$categories = get_the_category();
	$category_ids = array();

	// Get the category IDs
	if (!empty($categories)) {
		foreach ($categories as $category) {
			$category_ids[] = $category->term_id;
		}
	}

	// Set up the arguments
	$args = array(
		'post_type' => 'post',
		'posts_per_page' => 4,
		'post_status' => 'publish',
		'category__in' => $category_ids,  // Add posts from these categories
		'post__not_in' => array(get_the_ID()),  // Exclude current post
	);

	$related_posts = new WP_Query($args);

	// Only create section if there are related posts
	if ($related_posts->have_posts()) : ?>
		<section class="mb-16 lg:mb-24 lg:mt-64 <?= !wp_is_mobile() ? 'container mx-auto' : '' ?>">
			<div class="flex items-center justify-center lg:justify-between lg:mb-0">
				<div>
					<h2 class="lg:mb-4 text-title-large text-on-surface">You may also like.</h2>
					<span class="block lg:mt-4 lg:mb-[10px] text-body-small">Discover insights, tips, and inspiration</span>
				</div>
				<a href="https://sendbypass.com/blog/" class="items-center justify-center hidden gap-8 lg:flex text-body-medium text-primary">
					All post
					<i class="mt-4 icon-arrow-left-md"></i>
				</a>
			</div>
			
			<?php if (!wp_is_mobile()): ?>
			<!-- Desktop Grid -->
			<div class="hidden gap-20 lg:grid lg:grid-cols-4">
				<?php while ($related_posts->have_posts()) : $related_posts->the_post(); ?>
					<?php get_template_part('template-parts/content', 'box'); ?>
				<?php endwhile; ?>
			</div>
			<?php else: ?>
				<!-- Mobile Slider -->
				<div class="pt-32 pl-16 splide related-posts-slider lg:hidden">
					<div class="splide__track">
						<div class="splide__list">
							<?php while ($related_posts->have_posts()) : $related_posts->the_post(); ?>
								<div class="splide__slide">
									<?php get_template_part('template-parts/content', 'box'); ?>
								</div>
							<?php endwhile; ?>
						</div>
					</div>
					<a href="https://sendbypass.com/blog/" class="items-center hidden gap-8 show-more lg:flex text-body-medium text-primary">
						All post
						<i class="mt-4 icon-arrow-left-md"></i>
					</a>
				</div>
			<?php endif; ?>
		</section>
	<?php 
	endif;
	wp_reset_postdata(); 
	?>
	<?php if(wp_is_mobile()) : ?>
    
    <div id="tocButton" class="border fixed left-[24px] bottom-[24px] text-primary p-16 rounded-large bg-surface-container-high z-10 cursor-pointer">
        Table of contents
    </div>

    <div id="tocContainer" class="hidden">
        <?php   
            $toc_content = generate_table_of_contents(get_the_content());
            echo $toc_content['toc'];
        ?>
    </div>
<?php endif; ?>
	
<!-- #post-<?php the_ID(); ?> -->
