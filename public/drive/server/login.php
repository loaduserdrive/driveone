<?php
session_start();

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    echo "Welcome, you are logged in to ZenStudio!";
} else {
    echo "Please log in to access this page.";
    header("Location: login.php");
    exit;
}
?>