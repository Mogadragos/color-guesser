<?php
include("../setup.php");

header("Access-Control-Allow-Headers: *");

$_POST = json_decode(file_get_contents("php://input"), true);
$pseudo = htmlspecialchars($_POST["pseudo"]);
$score = htmlspecialchars($_POST["score"]);


if($pseudo != "" && $score != "") {
    $sql = "INSERT INTO `colorguesser`(`pseudo`, `score`) VALUES (\"$pseudo\", \"$score\")";

    if ($mysqli -> query($sql) === TRUE) {
        echo "true";
        $mysqli -> close();
        return;
    }
}

echo "false";
$mysqli -> close();

?>