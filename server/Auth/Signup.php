<?php

    header("Access-Control-Allow-Methods:*");
    header("Access-Control-Allow-Origin:*");
    header("Access-Control-Allow-Headers:*");
    require_once("../Connection/Database.php");

    class SignupProps{
        protected $db;
        protected $httpMethod;
        protected $signupData;

        protected $gstNumber;
        protected $name;
        protected $address;
        protected $pincode;
        protected $industry;
        protected $state;

        protected $instamojo;
        protected $APIKey;
        protected $authToken;
        protected $privateSalt;
        protected $clientId;
        protected $clientSecret;

        protected $noOfBranch;
        protected $branches;
        protected $password;
        protected $email;
    }

    class Signup extends SignupProps{
        
        function __construct(){
            $this->db = new Database();
            $this->db = $this->db->connect();
            $this->httpMethod = $_SERVER['REQUEST_METHOD'];

            if($this->httpMethod == "POST"){
                $this->signupData = json_decode($_POST['signup_data']);
                $this->gstNumber = strip_tags(pg_escape_string($this->db,trim($this->signupData->companyInformation->gstNumber)));
                $this->name = strip_tags(pg_escape_string($this->db,trim($this->signupData->companyInformation->name)));
                $this->address = strip_tags(pg_escape_string($this->db,trim($this->signupData->companyInformation->address)));
                $this->pincode = strip_tags(pg_escape_string($this->db,trim($this->signupData->companyInformation->pincode)));
                $this->industry = strip_tags(pg_escape_string($this->db,trim($this->signupData->companyInformation->industry)));
                $this->state = strip_tags(pg_escape_string($this->db,trim($this->signupData->companyInformation->state)));

                $this->instamojo = strip_tags(pg_escape_string($this->db,trim($this->signupData->paymentInformation->instamojoUsername)));
                $this->APIKey = strip_tags(pg_escape_string($this->db,trim($this->signupData->paymentInformation->privateAPIKey)));
                $this->authToken = strip_tags(pg_escape_string($this->db,trim($this->signupData->paymentInformation->privateAuthToken)));
                $this->privateSalt = strip_tags(pg_escape_string($this->db,trim($this->signupData->paymentInformation->privateSalt)));
                $this->clientId = strip_tags(pg_escape_string($this->db,trim($this->signupData->paymentInformation->clientID)));
                $this->clientSecret = strip_tags(pg_escape_string($this->db,trim($this->signupData->paymentInformation->ClientSecret)));
                
                $this->noOfBranch = strip_tags(pg_escape_string($this->db,trim($this->signupData->branchInformation->noBranch)));
                $this->branches = strip_tags(pg_escape_string($this->db,json_encode($this->signupData->branchInformation->fields)));
                $this->password = md5(strip_tags(pg_escape_string($this->db,trim($this->signupData->branchInformation->password))));
                $this->email = strip_tags(pg_escape_string($this->db,trim($this->signupData->branchInformation->email)));
                
                if($this->checkUser()){
                    http_response_code(400);
                    echo "User already exists";
                }
                else{
                    $insert_user_query = "INSERT INTO users(gst_number, username,user_address, pincode, industry, user_state, payment_instamojo, payment_api_key, payment_auth_token, payment_private_salt, payment_client_id, payment_client_secret, no_of_branch, branches, user_password, email) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)";
                    $insert_user_prepare = pg_prepare($this->db,"create_user",$insert_user_query);
                    $insert_user_execute = pg_execute($this->db,"create_user",array($this->gstNumber,$this->name,$this->address,$this->pincode,$this->industry,$this->state,$this->instamojo,$this->APIKey,$this->authToken,$this->privateSalt,$this->clientId,$this->clientSecret,$this->noOfBranch,$this->branches,$this->password,$this->email));
                    if($insert_user_execute){
                        http_response_code(200);
                        echo json_encode("success");
                    }
                    else{
                        http_response_code(400);
                        echo json_encode("Error inserting data");
                    }
                }
            }
            else{
                http_response_code(404);
                echo json_encode("API expects POST request.");
            }
            
        }

        function checkUser(){
            if($this->checkTable()){
                $check_user_query = "SELECT * FROM users WHERE gst_number = $1 AND username = $2";
                $check_user_response = pg_prepare($this->db,"check_user",$check_user_query);
                $check_user_response = pg_execute($this->db,"check_user",array($this->gstNumber, $this->name));
                if(pg_num_rows($check_user_response) > 0){
                    return true;
                }
                else{
                    return false;
                }

            }
        }

        function checkTable(){
            $check_table_query = "SELECT * FROM information_schema.tables WHERE table_name = 'users'";
            $check_table_data = pg_query($this->db,$check_table_query);
            if(pg_num_rows($check_table_data) > 0){
                return true;
            }
            else{
                $create_table_query = "CREATE TABLE users(
                    gst_number bigint PRIMARY KEY,
                    username varchar(25),
                    user_address text,
                    pincode int,
                    industry varchar(25),
                    user_state varchar(25),
                    payment_instamojo text,
                    payment_api_key text,
                    payment_auth_token text,
                    payment_private_salt text,
                    payment_client_id text,
                    payment_client_secret text,
                    no_of_branch smallint,
                    branches json,
                    user_password varchar(50),
                    email text
                )";
                $create_table_result = pg_query($this->db,$create_table_query);
                $this->checkTable();
            }
        }



    }

    new Signup();

?>