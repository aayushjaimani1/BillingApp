<?php
    header("Access-Control-Allow-Methods:*");
    header("Access-Control-Allow-Origin:*");
    header("Access-Control-Allow-Headers:*");
    require_once("../Plugins/vendor/autoload.php");
    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;

    class VerifyUser{
        private $jwt;

        function __construct(){
            $this->verify();
        }

        function verify(){
            $headers = apache_request_headers();
            if (!isset($headers['Authorization'])) {
                header('Content-Type: application/json');
                echo json_encode(array('error' => 'Missing Authorization header'));
                return;
            }
            $this->jwt = str_replace('Bearer ', '',$headers['Authorization']);
            try{
                $decoded = JWT::decode($this->jwt, new Key('123', 'HS256'));
                $username = $decoded->username;
                $password = $decoded->password;
                echo json_encode(array('username' => $username,'password' => $password));
            }
            catch (Exception $e){
                http_response_code(404);
                echo json_encode(array('error' => 'Invalid or expired token'));
            }
        }
    }
    
    new VerifyUser();

?>