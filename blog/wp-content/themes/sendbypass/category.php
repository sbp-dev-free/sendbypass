<?php get_header(); ?>

<section class="container px-16 mx-auto mt-16 lg:mt-24">
  <!-- Archive Title -->
  <h1 class="my-6 text-display-medium text-on-surface"><?php single_cat_title(); ?></h1>
  
  <!-- Breadcrumb Navigation -->
  <ul class="flex items-center justify-start h-[16px] lg:pl-4 lg:mb-64 mb-48">
    <li class="flex items-center justify-center text-on-surface-variant text-body-small">
      <a href="<?= home_url() ?>" class="flex items-center justify-center hover:text-primary">
        Home <i class="icon-chevron-right-md text-[16px]"></i>
      </a>
    </li>
    <li class="flex items-center justify-center text-on-surface-variant text-body-small">
      <?php single_cat_title(); ?>
    </li>
  </ul>

  <!-- Posts Grid -->
  <div class="grid grid-cols-1 gap-y-12 lg:grid-cols-4 lg:gap-20 mb-80 lg:mb-24">
    <?php if ( have_posts() ) : ?>
      <?php while ( have_posts() ) : the_post(); ?>
        <?php get_template_part( 'template-parts/content', 'box' ); ?>
      <?php endwhile; ?>
      <?php the_posts_pagination(); ?>
    <?php else : ?>
      <p>Oops, there are no posts.</p>
    <?php endif; ?>
  </div>
</section>

<?php get_footer(); ?>