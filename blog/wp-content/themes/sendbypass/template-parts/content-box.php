<?php
/**
 * Template part for displaying boxes.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package sendbypass
 */
if ( get_post_type() == 'post' ) : ?>
    <figure class="p-4 pb-12 bg-white shadow-md m-t0 post-box rounded-medium">
            <a href="<?= esc_url( get_the_permalink() ) ?>" title="<?= the_title_attribute() ?>"> 
                <?php $pic_id = get_the_post_thumbnail()? get_post_thumbnail_id() : '';
                if ( $pic_id ) :?>
                    <div>
                        <?= wp_get_attachment_image( $pic_id, 'full', false, ['class' => 'object-cover rounded-small mx-auto mb-12 w-full','title' => get_the_title( $pic_id ) ] ); ?>
                    </div>
                <?php endif; ?>
                <figcaption class="p-8 py-0">
                    <span class="block w-full pb-8 text-on-surface-variant text-label-large">
                        <?= esc_html( get_the_title() ) ?>
                    </span>
                    <div class="flex items-center justify-between mt-8">
                        <?php if(get_field('read_time')): ?>
                            <span class="text-body-small text-outline">
                                <?php the_field('read_time') ?> min Read Time
                            </span>
                        <?php endif; ?>
                        <?php
                            $categories = get_the_category();
                            if( !empty( $categories ) ) :
                                $category_list = join( ', ', wp_list_pluck( $categories, 'name' ) ); 
                                echo '<span class="text-label-medium text-outline">'. wp_kses_post( $category_list ). '</span>';
                            endif; 
                        ?>
                    </div>
                </figcaption>
            </a>
    </figure>
<?php endif; ?>