<?php
include 'db.php';

$sql = "SELECT id, name, quantity, probability FROM gift WHERE quantity > 0";
$result = $conn->query($sql);

$gifts = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $gifts[] = $row;
    }
}
echo json_encode($gifts);
$conn->close();
?>
