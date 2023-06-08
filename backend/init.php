<?php

require_once __DIR__ . '/MarkingApi.php';
require_once __DIR__ . '/SiteApi.php';
require_once __DIR__ . '/Products.php';

const APP_PATH = __DIR__;
const DATA_PATH = __DIR__ . '/data';
define('BASE_PATH', dirname(__DIR__));

$config = require APP_PATH . '/config.php';

$landingHost = $_SERVER['SERVER_NAME'] ?? '';

$isDev = preg_match('#(dev|\.local)$#isu', $landingHost, $matches);

// при работе лэндинга на localhost - работать с магазином также на localhost
if ($isDev) {
    $config['shopHost'] = 'http://zagotovshik.local';
    // $config['markingHost'] = 'http://zrm.local';
    $config['markingHost'] = 'http://work-crm.local';
}

$siteApi = new \App\SiteApi($config['shopHost'], $config['project'], $config['token'], $config['chat']);

$markingApi = new \App\MarkingApi($config['markingHost'], $config['project'], $config['token']);

$products = new \App\Products($config['items'], $siteApi);

