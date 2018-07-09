<?php
/* 
 * Author: Antonio Rodriguez Benitez (c)
 * Date: 19/01/2018 (revised: 23/01/2018)
 * Summary: Obtain JSON exercise (PHP file)
 */
session_start();

echo json_encode($_SESSION['MULTIMEDIA']['MULTIMEDIA']);

?>