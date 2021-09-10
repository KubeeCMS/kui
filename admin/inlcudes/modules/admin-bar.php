<?php
if (!defined('ABSPATH')) {
    exit();
}

class Admin_2020_module_admin_bar
{
    public function __construct($version, $path, $utilities)
    {
        $this->version = $version;
        $this->path = $path;
        $this->utils = $utilities;
		$this->front = false;
		$this->notices = '';
		$this->kill = false;
    }

    /**
     * Loads menu actions
     * @since 1.0
     */

    public function start()
    {
				
		///REGISTER THIS COMPONENT
		add_filter('admin2020_register_component', array($this,'register'));
		
		if(!$this->utils->enabled($this)){
			return;
		}
		
		$info = $this->component_info();
		$optionname = $info['option_name'];
		$notification_center = $this->utils->get_option($optionname,'notification-center-disabled');
		
		if($this->utils->is_locked($optionname)){
			return;
		}
		
		add_filter('admin_body_class', array($this, 'add_body_classes'));
		add_action('admin_enqueue_scripts', [$this, 'add_scripts']);
		add_action('admin_enqueue_scripts', [$this, 'add_styles']);
		add_action('admin_head', [$this, 'build_admin_bar']);
		
		///AJAX
		add_action('wp_ajax_a2020_master_search', array($this,'a2020_master_search'));
		add_action('wp_ajax_uipress_get_create_types', array($this,'uipress_get_create_types'));
		add_action('wp_ajax_uipress_get_updates', array($this,'uipress_get_updates'));
		add_action('wp_ajax_uipress_get_notices', array($this,'uipress_get_notices'));
		
		//CAPTURE NOTICES
		if($notification_center != 'true'){
			add_action('admin_notices', [$this,'start_capture_admin_notices'],-99);
			add_action('admin_notices', [$this, 'capture_admin_notices'],999);
		}
		
		
		
    }
	
	public function start_front()
	{
				
		$this->front = true;		
		
		if(!$this->utils->enabled($this)){
			return;
		}
		
		$info = $this->component_info();
		$optionname = $info['option_name'];
		$notification_center = $this->utils->get_option($optionname,'notification-center-disabled');
		$hide_admin = $this->utils->get_option($optionname,'hide-admin');
		$admin_front = $this->utils->get_option($optionname,'load-front');
		
		if($this->utils->is_locked($optionname)){
			return;
		}
		
		if($hide_admin == 'true') {
			add_filter('show_admin_bar', 'is_blog_admin');
			return;
		}
		
		if($admin_front != 'true') {
			return;
		}
		
		add_action('init', array($this, 'add_front_actions_and_filters'));
		
		
	}
	
	
	/**
	* Adss front admin filters and actions for the toolbar
	* @since 2.1.6
	*/
	public function add_front_actions_and_filters(){
		
		if(!is_admin_bar_showing()){
			return;
		}
	
		add_filter('body_class',array($this, 'add_front_body_class'));
		add_action('wp_enqueue_scripts', array($this, 'add_vue'));
		add_action('wp_enqueue_scripts', array($this, 'add_scripts'));
		add_action('wp_enqueue_scripts', array($this, 'add_styles'));
		add_action('wp_head', array($this, 'capture_admin_bar'));
		add_action('wp_body_open', array($this, 'build_admin_bar'));
		
		///AJAX
		add_action('wp_ajax_a2020_master_search', array($this,'a2020_master_search'));
		add_action('wp_ajax_uipress_get_create_types', array($this,'uipress_get_create_types'));
		add_action('wp_ajax_uipress_get_updates', array($this,'uipress_get_updates'));
		add_action('wp_ajax_uipress_get_notices', array($this,'uipress_get_notices'));
			
	}
	
	/**
	* Captures admin bar for later output
	* @since 2.1.6
	*/
	
	function capture_admin_bar(  ) {
		
		ob_start();
		
		wp_admin_bar_render();
		
		$this->toolbar = ob_get_clean();
		 
	}
	
	/**
	* Adds class to front body class
	* @since 2.1.6
	*/
	
	function add_front_body_class( $classes ) {
		
			
		$darkmode = $this->utils->get_user_preference('darkmode');
		$dark_enabled = $this->utils->get_option('admin2020_admin_bar','dark-enabled');
		$bodyclass = '';
		
		$classes[] = 'a2020_admin_bar a2020_anchor_dark';
	
		if ($darkmode == 'true') {
			$classes[] = " a2020_night_mode";
		} else if ($darkmode == '' && $dark_enabled == 'true'){
			$classes[] = " a2020_night_mode";
		}
		 
		return $classes;
		 
	}
	
	
	/**
	* Capture admin notices
	* @since 2.9
	*/
	
	public function start_capture_admin_notices(){
		ob_start();
	}
	
	
	/**
	* End Capture admin notices and save out to transient
	* @since 2.9 
	*/
	
	public function capture_admin_notices(){
		
		$userid = get_current_user_id();
		$notices = ob_get_clean();
		
		set_transient( 'uip-admin-notices-'.$userid , $notices, 0.5 * HOUR_IN_SECONDS );
	}
	
	/**
	 * Register admin bar component
	 * @since 1.4
	 * @variable $components (array) array of registered admin 2020 components
	 */
	public function register($components){
		
		array_push($components,$this);
		return $components;
		
	}
	
	/**
	 * Returns component info for settings page
	 * @since 1.4
	 */
	public function component_info(){
		
		$data = array();
		$data['title'] = __('Admin Bar','admin2020');
		$data['option_name'] = 'admin2020_admin_bar';
		$data['description'] = __('Creates new admin bar, adds user off canvas menu and builds global search','admin2020');
		return $data;
		
	}
	
	
	/**
	 * Returns settings options for settings page
	 * @since 2.1
	 */
	public function get_settings_options(){
		
		$info = $this->component_info();
		$optionname = $info['option_name'];
		
		$settings = array();
		
		
		$temp = array();
		$temp['name'] = __('Admin Bar Disabled For','admin2020');
		$temp['description'] = __("UiPress admin bar module will be disabled for any users or roles you select",'admin2020');
		$temp['type'] = 'user-role-select';
		$temp['optionName'] = 'disabled-for'; 
		$temp['value'] = $this->utils->get_option($optionname,$temp['optionName'], true);
		$settings[] = $temp;
		
		$temp = array();
		$temp['name'] = __('Logo Light Mode','admin2020');
		$temp['description'] = __("Sets the logo for the admin bar in light mode.",'admin2020');
		$temp['type'] = 'image';
		$temp['optionName'] = 'light-logo'; 
		$temp['value'] = $this->utils->get_option($optionname,$temp['optionName']);
		$settings[] = $temp;
		
		$temp = array();
		$temp['name'] = __('Logo Dark Mode','admin2020');
		$temp['description'] = __("Optional dark mode logo for admin bar.",'admin2020');
		$temp['type'] = 'image';
		$temp['optionName'] = 'dark-logo'; 
		$temp['value'] = $this->utils->get_option($optionname,$temp['optionName']);
		$settings[] = $temp;
		
		$temp = array();
		$temp['name'] = __('Background color (light mode)','admin2020');
		$temp['description'] = __("Sets admin bar background color in light mode.",'admin2020');
		$temp['type'] = 'color';
		$temp['optionName'] = 'light-background'; 
		$temp['value'] = $this->utils->get_option($optionname,$temp['optionName']);
		$temp['default'] = '#fff';
		$settings[] = $temp;
		
		$temp = array();
		$temp['name'] = __('Background color (dark mode)','admin2020');
		$temp['description'] = __("Sets admin bar background color in dark mode.",'admin2020');
		$temp['type'] = 'color';
		$temp['optionName'] = 'dark-background'; 
		$temp['value'] = $this->utils->get_option($optionname,$temp['optionName']);
		$temp['default'] = '#222';
		$settings[] = $temp;
		
		$temp = array();
		$temp['name'] = __('Force Light text (light mode)','admin2020');
		$temp['description'] = __("If you want to use a dark background color for the admin bar background in light mode, this option will make the text color light.",'admin2020');
		$temp['type'] = 'switch';
		$temp['optionName'] = 'force-light-text'; 
		$temp['value'] = $this->utils->get_option($optionname,$temp['optionName']);
		$settings[] = $temp;
		
		$temp = array();
		$temp['name'] = __('Hide admin bar links (left side)','admin2020');
		$temp['description'] = __("Disables legacy links on left side of admin bar for all users. Also hides the user preference.",'admin2020');
		$temp['type'] = 'switch';
		$temp['optionName'] = 'legacy-admin'; 
		$temp['value'] = $this->utils->get_option($optionname,$temp['optionName']);
		$settings[] = $temp;
		
		$temp = array();
		$temp['name'] = __('Disable Search','admin2020');
		$temp['description'] = __("Disables search icon and global search function from admin bar.",'admin2020');
		$temp['type'] = 'switch';
		$temp['optionName'] = 'search-enabled'; 
		$temp['value'] = $this->utils->get_option($optionname,$temp['optionName']);
		$settings[] = $temp;
		
		$temp = array();
		$temp['name'] = __('Disable Create Button','admin2020');
		$temp['description'] = __("Disables the 'create' button in the admin bar.",'admin2020');
		$temp['type'] = 'switch';
		$temp['optionName'] = 'new-enabled'; 
		$temp['value'] = $this->utils->get_option($optionname,$temp['optionName']);
		$settings[] = $temp;
		
		$temp = array();
		$temp['name'] = __('Disable View Website Button','admin2020');
		$temp['description'] = __("Disables the view website link button in the admin bar.",'admin2020');
		$temp['type'] = 'switch';
		$temp['optionName'] = 'view-enabled'; 
		$temp['value'] = $this->utils->get_option($optionname,$temp['optionName']);
		$settings[] = $temp;
		
		$temp = array();
		$temp['name'] = __('Set Dark Mode as Default','admin2020');
		$temp['description'] = __("If enabled, dark mode will default to true for users that haven't set a preference.",'admin2020');
		$temp['type'] = 'switch';
		$temp['optionName'] = 'dark-enabled'; 
		$temp['value'] = $this->utils->get_option($optionname,$temp['optionName']);
		$settings[] = $temp;
		
		$temp = array();
		$temp['name'] = __('Load UIPress admin bar on front end','admin2020');
		$temp['description'] = __("If enabled, UiPress admin bar will be load on the front end. Please note, this will not work on all themes and styling will vary..",'admin2020');
		$temp['type'] = 'switch';
		$temp['optionName'] = 'load-front'; 
		$temp['value'] = $this->utils->get_option($optionname,$temp['optionName']);
		$settings[] = $temp;
		
		$temp = array();
		$temp['name'] = __('Hide admin bar on front end','admin2020');
		$temp['description'] = __("If enabled, front end admin bar will not load.",'admin2020');
		$temp['type'] = 'switch';
		$temp['optionName'] = 'hide-admin'; 
		$temp['value'] = $this->utils->get_option($optionname,$temp['optionName']);
		$settings[] = $temp;
		
		$temp = array();
		$temp['name'] = __('Disable Notification Center','admin2020');
		$temp['description'] = __("If disabled, notifcations will show in the normal way",'admin2020');
		$temp['type'] = 'switch';
		$temp['optionName'] = 'notification-center-disabled'; 
		$temp['value'] = $this->utils->get_option($optionname,$temp['optionName']);
		$settings[] = $temp;
		
		$temp = array();
		$temp['name'] = __('Post Types available in Search','admin2020');
		$temp['description'] = __("The global search will only search the selected post types.",'admin2020');
		$temp['type'] = 'post-type-select';
		$temp['optionName'] = 'post-types-search'; 
		$temp['value'] = $this->utils->get_option($optionname,$temp['optionName'], true);
		$settings[] = $temp;
		
		$temp = array();
		$temp['name'] = __('Post Types available in create button (new)','admin2020');
		$temp['description'] = __("Only the selected post types will show up in the create dropdown.",'admin2020');
		$temp['type'] = 'post-type-select';
		$temp['optionName'] = 'post-types-create'; 
		$temp['value'] = $this->utils->get_option($optionname,$temp['optionName'], true);
		$settings[] = $temp;
		
		$temp = array();
		$temp['name'] = __('Only show notifcations to','admin2020');
		$temp['description'] = __("UiPress will hide all notifications from all users except those selected below",'admin2020');
		$temp['type'] = 'user-role-select';
		$temp['optionName'] = 'notifcations-disabled-for'; 
		$temp['value'] = $this->utils->get_option($optionname,$temp['optionName'], true);
		$settings[] = $temp;
		
		$temp = array();
		$temp['name'] = __('Only show updates to','admin2020');
		$temp['description'] = __("UiPress will hide all updates from all users except those selected below",'admin2020');
		$temp['type'] = 'user-role-select';
		$temp['optionName'] = 'updates-disabled-for'; 
		$temp['value'] = $this->utils->get_option($optionname,$temp['optionName'], true);
		$settings[] = $temp;
		
		$temp = array();
		$temp['name'] = __('Show site title in admin bar','admin2020');
		$temp['description'] = __("If enabled, the site title will be displayed in the admin bar next to the logo",'admin2020');
		$temp['type'] = 'switch';
		$temp['optionName'] = 'show-site-logo'; 
		$temp['value'] = $this->utils->get_option($optionname,$temp['optionName']);
		$settings[] = $temp;
		
		return $settings;
		
	}
	
	
	/**
	* Output body classes
	* @since 1 
	*/
	
	public function add_body_classes($classes) {
		
		$bodyclass = " a2020_admin_bar";
		
		return $classes.$bodyclass;
	}
	
	
	
	
	/**
	* Adds Vue to run on front end admin bar
	* @since 2.1.5 
	*/
	
	public function add_vue(){
		
		///LOAD VUE
		wp_enqueue_script('a2020-vue-build', $this->path . 'assets/js/vuejs/vue-global-dev.js', array('jquery'),$this->version);
		
	}
	/**
	* Adds required uipress scripts for admin bar
	* @since 2.1.5 
	*/
	
	public function add_scripts(){
	  
	  
		///ENSURE WE ARE NOT LOADING ON FRONT UNLESS NECESSARY
		global $pagenow;
		if(!is_user_logged_in() && $pagenow != 'wp-login.php'){
		  return;
		}
		///ADMIN BAR OPTIONS
		$info = $this->component_info();
		$optionname = $info['option_name'];
		$adminbaroptions = $this->utils->get_module_option($optionname);
		
		///ADMIN BAR DEFAULTS
		$defaults = array(
			'logo' => esc_url($this->path.'/assets/img/default_logo.png'),
			'darkLogo' => esc_url($this->path.'/assets/img/default_logo_dark.png'),
			'adminHome' => $this->get_admin_home_url(),
			'siteHome' => get_home_url(),
			'logOut' => wp_logout_url(),
			'siteName' => get_bloginfo( 'name' ),
			'front' => !is_admin(),
			'user' => array(
				'initial' => $this->get_user_details('initial'),
				'username' => $this->get_user_details('username'),
				'email' => $this->get_user_details('email'),
				'img' => get_avatar_url($this->utils->get_user_id()),
				'prefs' => array(
					'darkMode' => $this->utils->get_user_preference('darkmode'),
					'screenOptions' => $this->utils->get_user_preference('screen_options'),
					'legacyAdmin' => $this->utils->get_user_preference('legacy_admin_links'),
				),
			)
			
		);
		
		///TOOLBAR TRANSLATIONS
		$translations = array( 
			'search' => __('Search','admin2020'),
			'view' => __('View','admin2020'),
			'edit' => __('Edit','admin2020'),
			'showMore' => __('Show more','admin2020'),
			'otherMatches' => __('other matches','admin2020'),
			'nothingFound' => __('Nothing found','admin2020'),
			'viewSite' => __('View Site','admin2020'),
			'viewDashboard' => __('View Dashboard','admin2020'),
			'searchSite' => __('Search Site','admin2020'),
			'create' => __('Create','admin2020'),
			'createNew' => __('Create New','admin2020'),
			'viewSite' => __('View Site','admin2020'),
			'updates' => __('Updates','admin2020'),
			'preferences' => __('Preferences','admin2020'),
			'darkMode' => __('Dark mode','admin2020'),
			'showScreenOptions' => __('Show screen options toggle','admin2020'),
			'screenOptions' => __('Screen options','admin2020'),
			'hideLegacy' => __('Hide admin bar links (left)','admin2020'),
			'logOut' => __('Logout','admin2020'),
			'notifications' => __('Notifications','admin2020'),
			'hideNotification' => __('Hide notification','admin2020'),
			'hiddenNotification' => __('hidden notifications','admin2020'),
			'showAll' => __('show all','admin2020'),
			'notificationHidden' => __('Notifiction Hidden','admin2020'),
			'toggleMenu' => __('Toggle Menu','admin2020'),
		);
		 
		///RETURN ARRAY
		$barsettings = array(
			'defaults' => $defaults,
			'user' => $adminbaroptions,
			'translations' => $translations,
		);
		
		
		
	  
	  
		wp_enqueue_script('admin-bar-app', $this->path . 'assets/js/admin2020/admin-bar-app-new.min.js', array('jquery'),$this->version, true );
		wp_localize_script('admin-bar-app', 'admin2020_admin_bar_ajax', array(
		   'ajax_url' => admin_url('admin-ajax.php'),
		   'security' => wp_create_nonce('admin2020-admin-bar-security-nonce'),
		   'options' => json_encode($barsettings),
		)); 
	  
	}
	
	/**
	 * Adds admin bar styles
	 * @since 1.0
	 */

	public function add_styles()
	{
		
		///ENSURE WE ARE NOT LOADING ON FRONT UNLESS NECESSARY
		global $pagenow;
		if(!is_user_logged_in() && $pagenow != 'wp-login.php'){
			return;
		}
		
		wp_register_style(
			'admin2020_admin_bar',
			$this->path . 'assets/css/modules/admin-bar-new.css',
			array('admin-bar'),
			$this->version
		);
		wp_enqueue_style('admin2020_admin_bar');
		
	}
	
	/**
	* Builds new uipress admin bar
	* @since 2.1.6
	*/
	public function build_admin_bar(){
		
		?>
		
		<div id="uip-admin-bar" uk-sticky="sel-target: . a2020-admin-bar;">
			
			
			<div class="a2020-admin-bar uk-background-default uk-padding-small a2020-border bottom" 
			:style="{ 'background-color': customBackGround() }"
			:class="checkTextColor()">
				
				<!--LOADING PLACEHOLDER -->
				<div v-if="loading" class="uk-flex uk-flex-row uk-animation-fade uk-animation-fast">
					<div>
						<svg class="uk-margin-right" height="34" width="34"><circle cx="17" cy="17" r="17" stroke-width="0" fill="#bbbbbb2e" /></svg>
					</div>
					<div >
						<svg class="uk-margin-small-right" height="34" width="75">
							<rect width="75" height="34" rx="5" fill="#bbbbbb2e"/>
						</svg>
					</div>
					<div >
						<svg class="uk-margin-small-right" height="34" width="75">
							<rect width="75" height="34" rx="5" fill="#bbbbbb2e"/>
						</svg>
					</div>
					<div class="uk-flex-1">
						<svg class="uk-margin-small-right" height="34" width="75">
							<rect width="75" height="34" rx="5" fill="#bbbbbb2e"/>
						</svg>
					</div>
					<div class="">
						<svg class="uk-margin-small-right" height="34" width="50">
							<rect width="75" height="34" rx="5" fill="#bbbbbb2e"/>
						</svg>
					</div>
					<div class="">
						<svg class="uk-margin-small-right" height="34" width="50">
							<rect width="75" height="34" rx="5" fill="#bbbbbb2e"/>
						</svg>
					</div>
					<div class="">
						<svg class="uk-margin-small-right" height="34" width="50">
							<rect width="75" height="34" rx="5" fill="#bbbbbb2e"/>
						</svg>
					</div>
					<div class="">
						<svg height="34" width="34"><circle cx="17" cy="17" r="17" stroke-width="0" fill="#bbbbbb2e" /></svg>
					</div>
				</div>
				
				<!--TOOLBAR  -->
				<div class="uk-flex-row hidden" :class="{'uk-flex' : !loading}" >
					<div v-if="isSmallScreen()" class="uk-flex uk-flex-middle uk-margin-small-right">
						<a href="#" uk-toggle="target: #a2020-mobile-nav" class="uk-link-text">
							<span :uk-tooltip="'delay:500;title:' + settings.translations.toggleMenu"
							class="material-icons">menu_open</span>
						</a>
					</div>
					<div>
						<toolbar-logo :settings="settings"></toolbar-logo>
					</div>
					<div class="uk-flex-1">
						<div class="admin2020_legacy_admin"
						v-if="showLegacy() && !isSmallScreen()" >
							<?php 
							if($this->front){
								echo $this->toolbar;
							} else {
								echo wp_admin_bar_render();
							}
							 ?>
						</div>
					</div>
					<div class="">
						<toolbar-search :settings="settings"></toolbar-search>
					</div>
					<div class="">
						<toolbar-links :settings="settings"></toolbar-links>
					</div>
					<div class="">
						<toolbar-create :settings="settings"></toolbar-create>
					</div>
					<div class="">
						<toolbar-offcanvas :settings="settings" 
						@updateprefs="settings.defaults.user.prefs = getDataFromEmit($event)"></toolbar-offcanvas>
					</div>
				</div>
				
			</div>
		
		</div>
		<?php
		
	}
	
	
	/**
	* Gets default or custom admin home url
	* @since 2.1.6
	*/
	
	public function get_admin_home_url(){
		
		$optionname = 'admin2020_admin_login';
		$redirect = $this->utils->get_option($optionname,'login-redirect');
		$redirectCustom = $this->utils->get_option($optionname,'login-redirect-custom');
		$redirect_to = admin_url();
		
		if($redirect == 'true' && !$redirectCustom){
			$redirect_to = admin_url() . "admin.php?page=uip-overview";
		}
		
		if($redirectCustom && $redirectCustom != ''){
			
			if($this->utils->isAbsoluteUrl($redirectCustom)){
				$redirect_to = $redirectCustom;
			} else {
				$redirect_to = admin_url() . $redirectCustom;
			}
		}
		
		return $redirect_to;
		
	}
	
	
	/**
	* Gets user info
	* @since 2.1.6
	*/
	
	public function get_user_details($type){
	
		$current_user = $this->utils->get_user();
		
		$username = $current_user->user_login;
		$email = $current_user->user_email;
		$first = $current_user->user_firstname;
		$last = $current_user->user_lastname;
		
		if($type == 'username'){
			return strtolower($username);
		}
		
		if($type == 'email'){
			return strtolower($email);
		}
		
		if($type == 'initial'){
			
			if($first == "" || $last == ""){
				$name_string = str_split($username,1);
				$name_string = $name_string[0];
			} else {
				$name_string = str_split($first,1)[0];
			}
			
			return strtolower($name_string);
			
		}
		
		
		
	}
	/**
	* Gets the specified post types for the tollbar create button
	* @since 2.1.6
	*/
	
	public function uipress_get_create_types(){
		
		if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('admin2020-admin-bar-security-nonce', 'security') > 0) {
			
			$info = $this->component_info();
			$optionname = $info['option_name'];
			$post_types_create = $this->utils->get_option($optionname,'post-types-create');
			
			if($post_types_create == '' || !$post_types_create){
				$args = array('public'   => true);
				$output = 'objects'; 
				$post_types = get_post_types($args,$output);
			} else {
			  	$post_types = $this->utils->get_post_types();
			}
			
			///FORMAT POST TYPES
			$formattedPostTypes = array();
		  
			foreach($post_types as $type){
				$temp = array();
				
				if($post_types_create == '' || !$post_types_create){
					$name = $type->name;
					$temp['href'] = admin_url('post-new.php?post_type='.$name);
					$temp['name'] = $type->labels->singular_name;
					$temp['icon'] = $type->menu_icon;
					$temp['all'] = $type;
					$formattedPostTypes[] = $temp;
				} else {
					if(in_array($type->name, $post_types_create)){
						$name = $type->name;
						$temp['href'] = admin_url('post-new.php?post_type='.$name);
						$temp['icon'] = $type->menu_icon;
						$temp['name'] = $type->labels->singular_name;
						$formattedPostTypes[] = $temp;
					}
				}
				
			}
			
			$returndata = array();
			$returndata['types'] = $formattedPostTypes;
			echo json_encode($returndata);
			
		}
		
		die();
	}
	
	
	/**
	* Gets uipress updates 
	* @since 2.1.6
	*/
	
	public function uipress_get_updates(){
		
		if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('admin2020-admin-bar-security-nonce', 'security') > 0) {
			
			$info = $this->component_info();
			$optionname = $info['option_name'];
			$showUpdates = $this->valid_for_user( $this->utils->get_option($optionname,'updates-disabled-for', true));
			
			if($showUpdates == 'false') {
				$returndata = array();
				$returndata['updates'] = array();
				$returndata['total'] = 0;
				echo json_encode($returndata);
				die();
			}
			
			$updates = $this->utils->get_total_updates();
			$adminurl = get_admin_url();
			
			$formatted = array(
				'wordpress' => array(
					'total' => $updates['wordpress'],
					'title' => __('Core','admin2020'),
					'icon' => 'system_update_alt',
					'href' => $adminurl.'update-core.php',
				),
				'theme' => array(
					'total' => $updates['themeCount'],
					'title' => __('Themes','admin2020'),
					'icon' => 'extension',
					'href' => $adminurl.'themes.php',
				),
				'plugins' => array(
					'total' => $updates['pluginCount'],
					'title' => __('Plugins','admin2020'),
					'icon' => 'color_lens',
					'href' => $adminurl.'plugins.php',
				)
			);
			
			if(!is_array($supressedNotifications)){
				$supressedNotifications = array();
			}
			
			
			
			$returndata = array();
			$returndata['updates'] = $formatted;
			$returndata['total'] = $updates['total'];
			echo json_encode($returndata);
			
		}
		
		die();
	}
	
	
	/**
	* Gets uipress notices 
	* @since 2.1.6
	*/
	
	public function uipress_get_notices(){
		
		if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('admin2020-admin-bar-security-nonce', 'security') > 0) {
			
			
			$userid = get_current_user_id();
			$notices = get_transient( 'uip-admin-notices-'.$userid );
			
			$info = $this->component_info();
			$optionname = $info['option_name'];
			$supressedNotifications = $this->utils->get_user_preference('a2020_supressed_notifications');
			$showNotifcations = $this->valid_for_user( $this->utils->get_option($optionname,'notifcations-disabled-for', true));
			
			if(!is_array($supressedNotifications)){
				$supressedNotifications = array();
			}
			
			if($showNotifcations == 'false') {
				$notices = array();
			}
			
			$returndata = array();
			$returndata['notices'] = $notices;
			$returndata['supressed'] = $supressedNotifications;
			echo json_encode($returndata);
			
		}
		
		die();
	}
	
	/**
	* Searches all WP content
	* @since 1.4
	*/
	
	public function a2020_master_search(){
		
		if (defined('DOING_AJAX') && DOING_AJAX && check_ajax_referer('admin2020-admin-bar-security-nonce', 'security') > 0) {
			
			$term = $_POST['search'];
			$page = $_POST['currentpage'];
			$perpage = $_POST['perpage'];
			
			$info = $this->component_info();
			$optionname = $info['option_name'];
			$post_types_enabled = $this->utils->get_option($optionname,'post-types-search');
			
			if($post_types_enabled == '' || !$post_types_enabled || !is_array($post_types_enabled)){
				$post_types = 'any';
			} else {
				$post_types = $post_types_enabled;
			}
			
			//BUILD SEARCH ARGS//shop_order
			$args = array(
			  '_a2020_meta_or_title' => $term, 
			  'posts_per_page' => $perpage,
			  'post_type' => $post_types,
			  'paged' => $page,
			  'post_status' => 'all',
			  'meta_query' => array(
				  'relation' => 'OR',
				  array(
					  'value' => $term,
					  'compare' => 'LIKE',
				  )
			  )
			);
			
			
			if(isset($_POST['posttypes'])){
				$postTypes = $_POST['posttypes'];
				$args['post_type'] = $postTypes;
				$args_meta['post_type'] = $postTypes;
			}
			if(isset($_POST['categories'])){
				$categories = $_POST['categories'];
				$args['category'] = $categories;
				$args_meta['category'] = $categories;
			}
			if(isset( $_POST['users'])){
				$users =  $_POST['users'];
				$args['author__in'] = $users;
				$args_meta['author__in'] = $users;
			}
			
			//$q1 = new WP_Query($args);
			//$q2 = new WP_Query($args_meta);
			
			//$result = new WP_Query();
			//$result->posts = array_unique( array_merge( $q1->posts, $q2->posts ), SORT_REGULAR );
			$result = new WP_Query($args);
			$result->post_count = count( $result->posts );
			
			$foundposts = $result->posts;
			$searchresults = array();
			$categorized = array();
			$categ = array();
				
			foreach ($foundposts as $item){
				
				
				$temp = array();
				$author_id = $item->post_author;
				$title =  $item->post_title;
				$status = get_post_status_object( get_post_status( $item->ID));
				$label = $status->label;
				
				$postype_single = get_post_type($item);
				$postype = get_post_type_object($postype_single);
				$postype_label = $postype->label;
				
				if(!$postype_label){
					$postype_label = __('Unkown Post Type','admin2020');
				}
				if(!$label || $label == ''){
					$label = __('Unkown','admin2020');
				}
				
				$editurl = get_edit_post_link($item, '&');
				$public = get_permalink($item);
				
				if ($postype_single == 'attachment' && wp_attachment_is_image($item)){
					
					$temp['image'] = wp_get_attachment_thumb_url(  $item->ID );
					
				}
				
				if ($postype_single == 'attachment'){
					$temp['attachment'] = true;
					
					$mime = get_post_mime_type($item->ID);
					$actualMime = explode("/", $mime);
					$actualMime = $actualMime[1];
					
					$temp['mime'] = $actualMime;
				}
				
				$temp['name'] = $title;
				
				if($term != ''){
					
					$foundtitle = str_ireplace($term, '<highlight>'.$term.'</highlight>', $title);
					$temp['name'] = $foundtitle;
					
				}
				
				$temp['editUrl'] = $editurl;
				$temp['type'] = $postype_label;
				$temp['status'] = $label;
				$temp['author'] = get_the_author_meta( 'user_login' , $author_id );
				$temp['date'] = get_the_date('j M y',$item);
				$temp['url'] = $public;
				
				
				$categorized[$postype_single]['label'] = $postype_label;
				$categorized[$postype_single]['found'][] = $temp;
				
				$searchresults[] = $temp;
				
			}
			
			$totalFound = $result->found_posts;
			$totalPages = $result->max_num_pages;
				
			$returndata = array();
			$returndata['founditems'] = $searchresults;
			$returndata['totalfound'] = $totalFound;
			$returndata['totalpages'] = $totalPages;
			$returndata['categorized'] = $categorized;
			echo json_encode($returndata);
		}
		die();
	}
	
	/**
	* Checks if an option is disabled for current user
	* @since 2.1.6
	*/
	
	public function valid_for_user($rolesandusernames){
		
		if( empty($rolesandusernames)) {
			return 'true';
		}
		
		if(!function_exists('wp_get_current_user')){
			return 'true';
		}
		
		
		$current_user = $this->utils->get_user();
		
		
		$current_name = $current_user->display_name;
		$current_roles = $current_user->roles;
		$formattedroles = array();
		$all_roles = wp_roles()->get_names();
		
		
		if(in_array($current_name, $rolesandusernames)){
			return 'true';
		}
		
		
		///MULTISITE SUPER ADMIN
		if(is_super_admin() && is_multisite()){
			if(in_array('Super Admin',$rolesandusernames)){
				return 'true';
			} else {
				return 'false';
			}
		}
		
		///NORMAL SUPER ADMIN
		if($current_user->ID === 1){
			if(in_array('Super Admin',$rolesandusernames)){
				return 'true';
			} else {
				return 'false';
			}
		}
		
		foreach ($current_roles as $role){
			
			$role_name = $all_roles[$role];
			if(in_array($role_name,$rolesandusernames)){
				return 'true';;
			}
			
		}
		
	}
	
	
}
