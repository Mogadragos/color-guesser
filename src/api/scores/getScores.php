<?php
include("../setup.php");

$sql = "SELECT `pseudo`, `score` FROM `colorguesser` ORDER BY score DESC";

$scores = array();

$result = $mysqli -> query($sql);

if($result) {
    while($row = $result->fetch_assoc()) {
        $scores[] = $row;
    }
}

echo json_encode($scores);
    
$mysqli -> close();

?>