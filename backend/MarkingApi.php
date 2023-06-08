<?php

namespace App;

class MarkingApi
{

    private $host;

    private $basePath = '/service/landing/api/';

    private $project;

    private $token;

    /**
     * SiteApi constructor.
     * @param $project
     * @param $token
     */
    public function __construct($host, $project, $token)
    {
        $this->host = $host;
        $this->project = $project;
        $this->token = $token;
    }

    public function exec($method, $data = [])
    {
        $data['project'] = $this->project;

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

    /**
     * Отправить сообщение в Telegram
     * @param string $message
     * @param int|null $chat ид чата отрицательный
     * @return mixed
     * @throws \Exception
     */
    public function registerProduct(array $data)
    {
        return $this->exec('register-product', $data);
    }

}