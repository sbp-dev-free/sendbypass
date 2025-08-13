<?php
/**
 * Template Name:  Homepage
 *
 * @package sendbypass
 */

get_header();?>

<section class="container px-16 mx-auto mt-16 lg:mt-24">
    <h1 class="my-6 text-display-medium text-on-surface">Blog Home</h1>
    <!-- Breadcrumb Navigation -->
    <ul class="flex items-center justify-start h-[16px] lg:pl-4 lg:mb-64 mb-48">
        <li class="flex items-center justify-center text-on-surface-variant text-body-small"> 
			<a href="https://sendbypass.com" class="flex items-center justify-center hover:text-primary">
                Home <i class="icon-chevron-right-md text-[16px]"></i>
            </a>
        </li>
        <li class="flex items-center justify-center text-on-surface-variant text-body-small">Blog Home</li>
    </ul>
    
    <!-- Posts Grid -->
    <div class="grid grid-cols-1 gap-y-12 lg:grid-cols-4 lg:gap-20 mb-80 lg:mb-24">
        <?php 
            $args = array(
                'post_type' => 'post',
                'posts_per_page' => wp_is_mobile() ? 5 : 24,
                'post_status' => 'publish',
            );

            $blog_box = new WP_Query( $args );
            if( $blog_box ->have_posts() ) :
                while ( $blog_box ->have_posts() ) : 

                        $blog_box->the_post(); 

                        get_template_part('template-parts/content', 'box');

                endwhile;
                wp_reset_postdata();
            else :
                echo 'Oops, there are no posts.';
            endif;
        ?>  
    </div> 
</section> 

<?php get_footer(); ?>