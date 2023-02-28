<?php

    header("Access-Control-Allow-Methods:*");
    header("Access-Control-Allow-Origin:*");
    header("Access-Control-Allow-Headers:*");
    require_once("../Connection/Database.php");
    require_once("../Plugins/vendor/autoload.php");

    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;

    class LoginProps{
        protected $db;
        protected $httpMethod;

        protected $username;
        protected $password;
    }

    class Login extends LoginProps{
        function __construct(){
            $this->db = new Database();
            $this->db = $this->db->connect();
            $this->httpMethod = $_SERVER['REQUEST_METHOD'];

            if($this->httpMethod == "POST"){
                $this->username = strip_tags(pg_escape_string($this->db, trim($_POST['username'])));
                $this->password = md5(strip_tags(pg_escape_string($this->db, trim($_POST['password']))));
                if($this->checkUser()){
                    $key = '123';
                    $payload = [
                        'username' => $this->username,
                        'password' => $this->password,
                        'exp' => time() + (60 * 60)
                    ];
                    $jwt = JWT::encode($payload, $key, 'HS256');
                    echo json_encode($jwt);
                }
                else{
                    echo json_encode("Username or email is wrong.");
                }
            }
            else{
                http_response_code(404);
                echo json_encode("API expects POST request.");
            }
        }

        function checkUser(){
            $check_user_query = "SELECT * FROM users WHERE username = $1 AND user_password = $2";
            $check_user_response = pg_prepare($this->db,"check_user",$check_user_query);
            $check_user_response = pg_execute($this->db,"check_user",array($this->username,$this->password));
            if(pg_num_rows($check_user_response) > 0){
                return true;
            }
            else{
                return false;
            }
        }
    }
    new Login();

?>