<?php

    header("Access-Control-Allow-Methods:*");
    header("Access-Control-Allow-Origin:*");
    header("Access-Control-Allow-Headers:*");
    require_once("../Plugins/vendor/autoload.php");
    require_once("../Connection/Database.php");

    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;

    class AddProductProps{
        private $jwt;
        private $db;
        private $username;
        private $password;
        private $data;
        private $pname;
        private $price;
        private $sku;
        private $category;
        private $image;
        private $stock;
    }

    class AddProduct extends AddProductProps{
        function __construct(){
            $this->db = new Database();
            $this->db = $this->db->connect();
            $this->branch = str_replace("/[^\p{L}\p{N}\s]/u","",$_POST['branch']);
            $this->branch = str_replace(" ","",$this->branch);
            $this->pname = $_POST['name'];
            $this->stock = $_POST['stock'];
            $this->price = $_POST['price'];
            $this->sku = $_POST['sku'];
            $this->category = $_POST['category'];
            $this->image = $_POST['image'];
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
                            echo json_encode(array('error' => 'Product already exists, try to add stock'));
                        }
                        else{
                            $this->add();
                        }
                    }else{
                        $create_table_query = "create table ".$this->table_name."(pname text,sku varchar,stock bigint,price varchar,image text,category varchar)";
                        $create_table_result = pg_query($this->db,$create_table_query);
                        $this->add();
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
        function add(){
            $add_query = "INSERT INTO ".$this->table_name."(pname,sku,stock,price,image,category) VALUES('".$this->pname."', '".$this->sku."', ".$this->stock.", '".$this->price."', '".$this->image."', '".$this->category. "')";
            $result = pg_query($this->db, $add_query);
            echo json_encode("success");
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
    }
    new AddProduct();

?>