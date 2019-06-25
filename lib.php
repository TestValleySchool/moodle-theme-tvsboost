<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Theme functions
 *
 * @package    theme_tvsboost
 * @copyright  Test Valley School
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
// This line protects the file from being accessed by a URL directly.                                                               
defined('MOODLE_INTERNAL') || die();

function theme_tvsboost_get_main_scss_content($theme) {
	global $CFG;

	$scss = '';
	$filename = !empty($theme->settings->preset) ? $theme->settings->preset : null;

	$fs = get_file_storage();

	$context = context_system::instance();

	if ('default.scss' == $filename) {
		// load default preset files directly from boost.
		$scss .= file_get_contents($CFG->dirroot . '/theme/boost/scss/preset/default.scss');
	}
	else if ('plain.scss' == $filename) {
		$scss .= file_get_contents($CFG->dirroot . '/theme/boost/scss/preset/plain.scss');
	}
	else if ($filename && ($presetfile = $fs->get_file($context->id, 'theme_tvsboost', 'preset', 0, '/', $filename))) {
		$scss .= $presetfile->get_content();
	}
	else {
		$scss .= file_get_contents($CFG->dirroot . '/theme/boost/scss/preset/default.scss');
	}

	$pre = file_get_contents($CFG->dirroot . '/theme/tvsboost/scss/pre.scss');
	$post = file_get_contents($CFG->dirroot . '/theme/tvsboost/scss/post.scss');


	return $pre . PHP_EOL . $scss . PHP_EOL . $post;
}
