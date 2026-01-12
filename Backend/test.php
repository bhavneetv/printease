<?php

include "notification/firebase-helper.php";

$response = sendFCMNotification(
    5,
    "user",
    "Order Update",
    "Your order has been printed successfully"
);

print_r($response);
