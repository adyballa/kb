<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 15.12.13
 * Time: 22:43
 */

$milliSeconds = intval($_REQUEST['milliSeconds']);
if($milliSeconds > 60*1000){
    // limit server abuse
$milliSeconds = 10;
}

usleep($milliSeconds * 1000); // note: usleep is in micro seconds not milli
