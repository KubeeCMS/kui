<?php
/*
Plugin Name: Kui
Plugin URI: https://github.com/KubeeCMS/kui/
Description: Admin extension with a streamlined dashboard, intuitive media library, dark mode and much more.
Version: 2.4.0
Author: Kubee
Text Domain: uipress
Domain Path: /admin/languages
Author URI: https://github.com/KubeeCMS/
*/

// If this file is called directly, abort.
if (!defined("ABSPATH")) {
  exit();
}

$uipOptions = get_option("uip-activation");
$uipOptions = array();
$uipOptions["key"] = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
$uipOptions["instance"] = "xxxx";
update_option("uip-activation", $uipOptions);
set_transient("uip-data-connect", true);


$version = "2.4.0";
$pluginName = "UiPress";
$textDomain = "uipress";
$pluginURL = plugin_dir_url(__FILE__);
$pluginPath = plugin_dir_path(__FILE__);

require $pluginPath . "admin/uipress-controller.php";

$uipress = new uipress_controller($version, $pluginName, $pluginPath, $textDomain, $pluginURL);
$uipress->run();

/// SHOW ERRORS
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);

