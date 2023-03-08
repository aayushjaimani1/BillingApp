<?php

    header("Access-Control-Allow-Methods:*");
    header("Access-Control-Allow-Origin:*");
    header("Access-Control-Allow-Headers:*");
    require_once("../Plugins/vendor/autoload.php");
    require_once("../Connection/Database.php");

    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;

    class ProductProps{
        protected $jwt;
        protected $db;
        protected $username;
        protected $password;
        protected $branch;
        protected $data;
        protected $array = array();
        protected $noOfRows;
    }

    class Product extends ProductProps{
        function __construct(){
            $this->db = new Database();
            $this->db = $this->db->connect();
            $this->branch = str_replace("/[^\p{L}\p{N}\s]/u","",$_GET['branch']);
            $this->branch = str_replace(" ","",$this->branch);
            $this->noOfRows = $_GET['row'];
            $this->getProduct();
        }

        function getProduct(){
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
                $check_user_query = "SELECT * FROM users WHERE username = $1 AND user_password = $2";
                $check_user_response = pg_prepare($this->db,"get_branch",$check_user_query);
                $check_user_response = pg_execute($this->db,"get_branch",array($this->username,$this->password));
                if(pg_num_rows($check_user_response) != 0){
                    $this->data = pg_fetch_row($check_user_response);
                    $check_table_query = "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '".$this->branch."_".$this->data[0]."')";
                    $result = pg_query($this->db, $check_table_query);
                    if(pg_fetch_row($result)[0] != 'f'){
                        $result_query = "SELECT * FROM ".$this->branch."_".$this->data[0]." LIMIT 10 OFFSET ".$this->noOfRows;
                        $result =  pg_query($this->db, $result_query);
                        if (pg_num_rows($result) > 0) {
                            while ($row = pg_fetch_assoc($result)) {
                                array_push($this->array, $row);
                            }
                            echo json_encode($this->array);
                        }
                        else{
                            echo json_encode("No product found");
                        }

                    }else{
                        echo json_encode("No product found");
                    }
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

    new Product();

?>