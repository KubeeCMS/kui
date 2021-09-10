<?php
/*
Plugin Name: KUI
Plugin URI: https://github.com/KubeeCMS/kui/
Description: Admin extension with a streamlined dashboard, Google Analytics & WooCommerce Integration, intuitive media library, dark mode and much more.
Version: 2.1.6
Author: Kubee
Text Domain: admin2020
Domain Path: /admin/languages
Author URI: https://github.com/KubeeCMS/
*/

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) exit;

////PRODUCT ID
$productid = "5ebe7e66701f5d0fe0b4c1ab";
////VERSION
$version = '2.1.6'; 
////NAME
$pluginName = 'UiPress Pro';
///PATH
$plugin_path = plugin_dir_url( __FILE__ );

require plugin_dir_path( __FILE__ ) . 'admin/inlcudes/class-admin-2020.php';

$plugin = new Admin_2020($productid,$version,$pluginName,$plugin_path);
$plugin->run();

/// SHOW ERRORS
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);
