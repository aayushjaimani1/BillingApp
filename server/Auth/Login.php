<?php

    header("Access-Control-Allow-Methods:*");
    header("Access-Control-Allow-Origin:*");
    header("Access-Control-Allow-Headers:*");
    require_once("../Connection/Database.php");

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
                $this->password = strip_tags(pg_escape_string($this->db, trim($_POST['password'])));
            }
            else{
                http_response_code(404);
                echo json_encode("API expects POST request.");
                if($this->checkUser()){

                }
                else{

                }
            }
        }

        function checkUser(){
            
        }
    }

?>