<?php
    header("Access-Control-Allow-Methods:*");
    header("Access-Control-Allow-Origin:*");
    header("Access-Control-Allow-Headers:*");
    require_once("../Plugins/vendor/autoload.php");
    require_once("../Connection/Database.php");

    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;

    class Branch{
        private $jwt;
        private $db;
        private $username;
        private $password;
        private $data;

        function __construct(){
            $this->db = new Database();
            $this->db = $this->db->connect();
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
                $this->username = $decoded->username;
                $this->password = $decoded->password;
                $check_user_query = "SELECT branches FROM users WHERE username = $1 AND user_password = $2";
                $check_user_response = pg_prepare($this->db,"get_branch",$check_user_query);
                $check_user_response = pg_execute($this->db,"get_branch",array($this->username,$this->password));
                if(pg_num_rows($check_user_response) != 0){
                    $this->data = pg_fetch_row($check_user_response);
                    echo json_encode(json_decode($this->data[0]));
                }
                else{
                    echo json_encode(array('error' => 'No branch found'));
                }
            }
            catch (Exception $e){
                http_response_code(404);
                echo json_encode(array('error' => 'Invalid or expired token'));
            }
        }
    }
    
    new Branch();

?>