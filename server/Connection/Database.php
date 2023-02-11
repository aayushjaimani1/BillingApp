<?php

    class Props{
        protected $conn;
        protected $host = "host = satao.db.elephantsql.com";
        protected $dbname = "dbname = iftqwlwu";
        protected $user = "user = iftqwlwu";
        protected $password = "password = sKxhxsNLIblOuhLGBPEiy7O4iXhF1nsP";
        protected $port = "port = 5432";
    }

    class Database extends Props{
        function __construct(){
            $this->conn = pg_connect("$this->host $this->port $this->dbname $this->user $this->password");
        }
        function connect(){
            if(!$this->conn){
                die("Connection failed");
            }
            return $this->conn;
        }
    }

?>