<?php

namespace App;

class SiteApi
{

    private $host;

    private $basePath = '/service/landing/api/';

    private $project;

    private $token;

    private $chat;

    private $tracking = [];

    /**
     * SiteApi constructor.
     * @param $project
     * @param $token
     */
    public function __construct($host, $project, $token, $chat)
    {
        $this->host = $host;
        $this->project = $project;
        $this->token = $token;
        $this->chat = $chat;
    }

    public function exec($method, $data = [])
    {
        $data['project'] = $this->project;
        $data['tracking'] = $this->tracking;

        $dataString = json_encode($data, JSON_UNESCAPED_UNICODE);

        $url = $this->host . $this->basePath . $method;

        $ch = curl_init();

        $headers = [
            'Accept-Language: ru',
            'Accept-Encoding: gzip',
            'Content-Type: application/json',
            'Authorization: Bearer ' . $this->token,
            'Content-Length' => strlen($dataString),
        ];

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $dataString);
        curl_setopt($ch, CURLOPT_ENCODING, true);
        curl_setopt($ch, CURLOPT_POSTREDIR, 2);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $result = curl_exec($ch);

        if (curl_errno($ch)) {
            throw new \Exception("site api request error " . curl_errno($ch) . "/ " . $result);
        }

        $response = json_decode($result, true);
        if (json_last_error()) {
            throw new \Exception("site api json decode error in '$result'");
        }

        return $response;
    }

    public function setTracking($tracking)
    {
        $this->tracking = $tracking;
    }

    public function getPrices($slugs)
    {
        return $this->exec('prices', compact('slugs'));
    }

    /**
     * цена корзины с промокодом
     * @param $cart
     * @param $code
     * @return mixed
     * @throws \Exception
     */
    public function getCartPrice($cart, $code)
    {
        return $this->exec('cart-price', compact('cart', 'code'));
    }

    public function checkPromoCode($data)
    {
        return $this->exec('check-promo-code', $data);
    }

    public function makeCreditRequest($data)
    {
        return $this->exec('make-credit-request', $data);
    }

    public function makeDolyamePayment($data)
    {
        return $this->exec('make-dolyame-payment', $data);
    }

    public function makeOrder($data)
    {
        return $this->exec('make-order', $data);
    }

    /**
     * Создать лид в CRM
     * @param array $data [name,phone,email,title,trace,comment]
     * @return mixed
     * @throws \Exception
     */
    public function lead($data)
    {
        return $this->exec('lead', $data);
    }

    /**
     * Отправить сообщение в Telegram
     * @param string $message
     * @param int|null $chat ид чата отрицательный
     * @return mixed
     * @throws \Exception
     */
    public function message(string $message, ?int $chat = null)
    {
        if (! $chat) {
            $chat = $this->chat;
        }

        return $this->exec('message', compact('message', 'chat'));
    }

    /**
     * Загрузить данные опт прайса
     */
    public function getOptPrice(string $priceCode)
    {
        return $this->exec('opt/price', compact('priceCode'));
    }

    /**
     * Создать опт заказ
     */
    public function makeOptOrder(string $priceCode, array $quantities, ?string $comment)
    {
        return $this->exec('opt/order', compact('priceCode', 'quantities', 'quantities', 'comment'));
    }

}