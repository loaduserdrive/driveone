<?php
session_start();

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    echo "Welcome, you created an account with ZenStudio!";
} else {
    echo "Please log in to access this page.";
    header("Location: home.php");
    exit;
}
?>