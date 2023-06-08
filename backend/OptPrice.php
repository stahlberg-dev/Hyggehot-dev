<?php

namespace App;

class OptPrice
{

    /** @var SiteApi */
    private $siteApi;

    /**
     * Products constructor.
     * @param array $items
     */
    public function __construct($siteApi)
    {
        $this->siteApi = $siteApi;
    }

    public function getPrice($priceCode)
    {
        return $this->siteApi->getOptPrice($priceCode);
    }

    public function makeOrder($priceCode, $quantities, $comment = '')
    {
        return $this->siteApi->makeOptOrder($priceCode, $quantities, $comment);
    }

}