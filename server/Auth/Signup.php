<?php

    header("Access-Control-Allow-Methods:*");
    header("Access-Control-Allow-Origin:*");
    require_once("../Connection/Database.php");

    class SignupProps{
        protected $db;
        protected $httpMethod;

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
                $this->gstNumber = $_POST['gstNumber'];
                $this->name = $_POST['name'];
                $this->address = $_POST['address'];
                $this->pincode = $_POST['pincode'];
                $this->industry = $_POST['industry'];
                $this->state = $_POST['state'];

                $this->instamojo = $_POST['instamojo'];
                $this->APIKey = $_POST['apikey'];
                $this->authToken = $_POST['authtoken'];
                $this->privateSalt = $_POST['privatesalt'];
                $this->clientId = $_POST['clientId'];
                $this->clientSecret = $_POST['clientsecret'];
                
                $this->noOfBranch = $_POST['noofbranch'];
                $this->branches = $_POST['branches'];
                $this->password = $_POST['password'];
                $this->email = $_POST['email'];
                
                if($this->checkUser()){

                }
                else{
                    
                }
            }
            else{
                http_response_code(404);
                echo "API expects POST request.";
            }
            
        }



    }

    new Signup();

?>