<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package sendbypass
 */

?>

	<footer id="colophon" class="site-footer">
		<div class="container px-16 pt-24 pb-64 mx-auto lg:pt-64 lg:pb-24 ">
			<div class="flex flex-col lg:flex-row lg:px-0 lg:mb-24 lg:gap-96">
				<div class="lg:w-[340px] mb-24 lg:mb-0">
					<img src="<?= get_template_directory_uri().'/src/image/logo.svg' ?>" alt="logo" class="w-[140px] h-[20px] mb-16" />
					<p class="m-0 text-on-surface text-body-medium">
						You can use the services you need while traveling.
						Send your packages at a reasonable price and in
						the shortest time, buy from outside your country
						and receive them at your destination.
					</p>
				</div>
				<div class="mb-24 lg:mb-0">
					<span class="block mb-16 text-title-large text-on-surface">Contact</span>
					<ul>
						<li class="flex items-center mb-8 gap-x-8">
							<span class="w-[5px] h-[5px] bg-outline-variant rounded-full"></span>
							<span class="text-on-surface text-label-large">Phone:</span>
							<span class="text-on-surface text-body-medium">+370 625 49672</span>
						</li>
						<li class="flex items-center mb-8 gap-x-8">
							<span class="w-[5px] h-[5px] bg-outline-variant rounded-full"></span>
							<span class="text-on-surface text-label-large">Email:</span>
							<span class="text-on-surface text-body-medium">Info@Sendbypass.com</span>
						</li>
						<li class="flex items-baseline mb-8 lg:items-center gap-x-8">
							<span class="w-[5px] h-[5px] bg-outline-variant rounded-full"></span>
							<span class="text-on-surface text-label-large">Address:</span>
							<span class="text-on-surface text-body-medium">J. Balčikonio g. 19, Vilnius, Vilniaus m. sav. Lithuania</span>
						</li>
					</ul>
				</div>
				<div>
					<span class="block mb-16 text-on-surface text-title-large">Company</span>
					<ul>
						<li class="flex items-center mb-8 gap-x-8 group">
							<span class="w-[5px] h-[5px] bg-outline-variant rounded-full transition-colors duration-150 group-hover:bg-primary"></span>
							<a href="https://sendbypass.com/about-us" class="transition-colors duration-150 text-on-surface text-label-large group-hover:text-primary">About us</a>
						</li>
						<li class="flex items-center mb-8 gap-x-8 group">
							<span class="w-[5px] h-[5px] bg-outline-variant rounded-full transition-colors duration-150 group-hover:bg-primary"></span>
							<a href="https://sendbypass.com/security" class="transition-colors duration-150 text-on-surface text-label-large group-hover:text-primary">Security</a>
						</li>
						<li class="flex items-center mb-8 gap-x-8 group">
							<span class="w-[5px] h-[5px] bg-outline-variant rounded-full transition-colors duration-150 group-hover:bg-primary"></span>
							<a href="https://sendbypass.com/faq" class="transition-colors duration-150 text-on-surface text-label-large group-hover:text-primary">FAQ</a>
						</li>
					</ul>
				</div>
			</div>
			<div class="flex flex-col items-center justify-between p-16 my-24 lg:py-4 lg:px-12 lg:my-0 lg:flex-row ite bg-surface-container rounded-small">
				<ul class="flex mb-16 lg:mb-0">
					<li><a href="https://x.com/sendbypass_co" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center p-8"><i class="icon-x-com text-[24px] text-primary"></i></a></li>
					<li><a href="https://www.facebook.com/share/1ALJ919RC2/"  target="_blank" rel="noopener noreferrer" class="flex items-center justify-center p-8"><i class="icon-facebook-circle text-[24px] text-primary"></i></a></li>
					<li><a href="https://www.instagram.com/sendbypass?igsh=MWpyNDB3enBmaWFtcA=="  target="_blank" rel="noopener noreferrer" class="flex items-center justify-center p-8"><i class="icon-instagram text-[24px] text-primary"></i></a></li>
					<!-- <li><a href="" class="flex items-center justify-center p-8"><i class="icon-telegram-circle text-[24px] text-primary"></i></a></li> -->
					<li><a href="https://www.linkedin.com/company/sendbypass"  target="_blank" rel="noopener noreferrer" class="flex items-center justify-center p-8"><i class="icon-linkedin-square text-[24px] text-primary"></i></a></li>
				</ul>
				<div class="flex flex-col justify-center lg:flex-row lg:items-center gap-x-16">
					<ul class="flex items-center mb-16 lg:mb-0 lg:gap-x-16">
						<li class="flex items-center pr-8 border-r lg:pr-0 lg:border-none border-surface-container-highest group">
							<a href="https://sendbypass.com/contact" class="transition-colors duration-150 text-on-surface text-body-small group-hover:text-primary">Contact us</a>
						</li>
						<li class="flex items-center px-8 border-r lg:px-0 lg:border-none border-surface-container-highest group">
							<a href="https://sendbypass.com/terms-of-service" class="transition-colors duration-150 text-on-surface text-body-small group-hover:text-primary">Terms of service</a>
						</li>
						<li class="flex items-center pl-8 lg:pl-0 group">
							<a href="https://sendbypass.com/privacy-policy" class="transition-colors duration-150 text-on-surface text-body-small group-hover:text-primary">Privacy policy</a>
						</li>
					</ul>
					
					<span class="block h-full pl-16 text-center border-l text-outline text-body-small border-surface-container-highest">Sendbypass © 2024.</span>
				</div>
			</div>
		</div>
	</footer>

	<div id="scroll-up" class="fixed rounded-large cursor-pointer bg-primary bottom-[24px] right-[24px] w-[56px] h-[56px] flex justify-center items-center">
		 <i class="icon-arrow-up-md text-[24px] text-[#fff]"></i>
	</div>
	
</div>

<?php wp_footer(); ?>

</body>
</html>
