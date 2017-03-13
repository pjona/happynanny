<?php

$rootDir = __DIR__ . '/../';

if (empty($_POST)) {
    return false;
}

// composer autoloader
require $rootDir . 'vendor/autoload.php';

$mail = new PHPMailer();
$dotEnv = new Dotenv\Dotenv($rootDir);
$dotEnv->load();

$mail->isSMTP();

// Enable SMTP debugging
// 0 = off (for production use)
// 1 = client messages
// 2 = client and server messages
$mail->SMTPDebug = 0;
$mail->Debugoutput = 'html';

$mail->Host = getenv('SMTP_HOST');
$mail->SMTPAuth = true;
$mail->Username = getenv('SMTP_LOGIN');
$mail->Password = getenv('SMTP_PASS');
$mail->CharSet = 'UTF-8';
$mail->setFrom(getenv('SMTP_LOGIN'), 'Happy Nanny');
$mail->addAddress('kontakt@happynanny.pl');
$mail->isHTML(true);

$type = isset($_POST['type']) ? $_POST['type'] : '';
$name = isset($_POST['name']) ? $_POST['name'] : '';
$email = isset($_POST['email']) ? $_POST['email'] : '';
$phone = isset($_POST['phone']) ? $_POST['phone'] : '';
$children = isset($_POST['children']) ? $_POST['children'] : '';
$address = isset($_POST['address']) ? $_POST['address'] : '';
$body = isset($_POST['body']) ? $_POST['body'] : '';

$mail->Subject = 'Nowe zamówienie ze strony happynanny.pl';
$mail->Body = '
    Typ opieki: ' . $type . '<br>
    Imię: ' . $name . '<br>
    E-mail: ' . $email . '<br>
    Telefon: ' . $phone . '<br>
    Dzieci: ' . $children . '<br>
    Adres: ' . $address . '<br>
    Treść: ' . $body . '<br>
';

if (!$mail->send()) {
    $return = 'Wiadomość nie została wysłana'; // $mail->ErrorInfo
} else {
    $return = 'Wiadomość została wysłana';
}

header('Content-type:application/json;charset=utf-8');
echo json_encode('<h2>' . $return . '</h2>');
