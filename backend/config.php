<?php

return [
    'leadName' => 'Каталог hyggelig',
    'shopHost' => 'https://zagotovshik.ru',
    'project' => 'hyggelig-catalog',
    'token' => 'BfugqEs1Ui4MWGuHaWpFivN7hCvMmT',
    'chat' => -719886644, // Hyggelig Заказы

    'markingHost' => 'https://work.zagk.ru',

    // комплекты (для каждого кода можно указать несколько позиций в заказе)
    // формат: [landingCode => [shopSlug => quantity]]
    'items' => [
        'hygge'                 => [],
        'hyggelig-kitchen-2'    => ['hyggelig-kitchen' => 1],
        'hyggelig-kitchen'      => ['hyggelig' => 1],
        'hyggelig-longheat'     => ['hyggelig-longheat' => 1],
        'hyggelig-light'        => ['hyggelig-light' => 1],
        'hyggelig-mini'         => ['hyggelig-mini' => 1],
        'hyggelig-minion'       => ['hyggelig-minion' => 1],

        'hygge-zontik-dymohoda' => ['hygge-zontik-dymohoda' => 1],
        'hygge-truba-dymohoda'  => ['hygge-truba-dymohoda' => 1],
        'hygge-ugol-dymohoda'   => ['hygge-ugol-dymohoda' => 1],
    ],
];
