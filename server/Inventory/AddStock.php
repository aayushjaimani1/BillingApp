<?php

    header("Access-Control-Allow-Methods:*");
    header("Access-Control-Allow-Origin:*");
    header("Access-Control-Allow-Headers:*");
    header('Content-Type: application/json');
    require_once("../Plugins/vendor/autoload.php");
    require_once("../Connection/Database.php");
    

    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;

    class AddStockProps{
        private $jwt;
        private $db;
        private $username;
        private $password;
        private $data;
        private $sku;
        private $stock;
    }
    class AddStock extends AddStockProps{
        function __construct(){
            $this->db = new Database();
            $this->db = $this->db->connect();
            $this->branch = str_replace("/[^\p{L}\p{N}\s]/u","",$_POST['branch']);
            $this->branch = str_replace(" ","",$this->branch);
            $this->stock = $_POST['stock_stock'];
            $this->sku = $_POST['stock_sku'];
            $this->verify();
        }
        function verify(){
            $headers = apache_request_headers();
            if (!isset($headers['Authorization'])) {
                echo json_encode(array('error' => 'Missing Authorization header'));
                return;
            }
            $this->jwt = str_replace('Bearer ', '',$headers['Authorization']);
            try{
                $decoded = JWT::decode($this->jwt, new Key('123', 'HS256'));
                $this->username = $decoded->username;
                $this->password = $decoded->password;
                $check_user_query = "SELECT gst_number FROM users WHERE username = $1 AND user_password = $2";
                $check_user_response = pg_prepare($this->db,"get_user",$check_user_query);
                $check_user_response = pg_execute($this->db,"get_user",array($this->username,$this->password));
                if(pg_num_rows($check_user_response) != 0){
                    $this->data = pg_fetch_row($check_user_response);
                    $this->table_name = $this->branch."_".$this->data[0];
                    $check_table_query = "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = '".$this->table_name."')";
                    $result = pg_query($this->db, $check_table_query);
                    if(pg_fetch_row($result)[0] != 'f'){
                        if($this->check_product()){
                            $this->add();
                        }
                        else{
                            echo json_encode(array('error' => 'Product doesn\'t exists'));
                        }
                    }else{
                        echo json_encode(array('error' => 'Product doesn\'t exists'));
                    }
                }
                else{
                    echo json_encode(array('error' => 'Invalid Request'));
                }
            }
            catch (Exception $e){
                http_response_code(404);
                echo json_encode(array('error' => 'Invalid or expired token'));
            }
        }
        function check_product(){
            $check_product = "SELECT * FROM ".$this->table_name." WHERE sku = '".$this->sku."'";
            $check_product_result = pg_query($this->db, $check_product);
            if(pg_num_rows($check_product_result) > 0){
                return true;
            }
            else{
                return false;
            }
        }
        function add(){
            $add_query = "UPDATE ".$this->table_name." SET stock = stock + ".$this->stock." WHERE sku = '".$this->sku."'";
            $result = pg_query($this->db, $add_query);
            echo json_encode("success");
        }
    }

    new AddStock();

?>