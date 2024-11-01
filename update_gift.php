<?php
include 'db.php';

$giftName = $_POST['giftName'];

$sql = "UPDATE gift SET quantity = quantity - 1 WHERE name = '$giftName' AND quantity > 0";
$conn->query($sql);

// Xóa phần thưởng nếu số lượng = 0
$sql = "DELETE FROM gift WHERE quantity = 0";
$conn->query($sql);

$conn->close();
?>
