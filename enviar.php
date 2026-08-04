<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $mail = new PHPMailer(true);

    try {
        // --- CONFIGURACIÓN DEL SERVIDOR SMTP (cPanel) ---
        $mail->isSMTP();
        $mail->Host       = 'mail.labsupply.com.ec'; // Reemplaza con tu servidor de correo
        $mail->SMTPAuth   = true;
        $mail->Username   = 'marketing@labsupply.com.ec'; // Tu correo de cPanel
        $mail->Password   = '6Lfl-60wSn&)';       // Tu contraseña de Webmail
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // O ENCRYPTION_STARTTLS
        $mail->Port       = 465;                        // 465 para SSL o 587 para TLS

        // --- DESTINATARIOS ---
        $mail->setFrom('marketing@labsupply.com.ec', 'Formulario Web');
        $mail->addAddress('marketing@labsupply.com.ec'); // A donde quieres que llegue

        // --- CONTENIDO DEL CORREO ---
        $mail->isHTML(true);
        $mail->Subject = 'Nuevo correo - LabSupply Web';
        
        $cuerpo = "<h2>Nueva consulta - LabSupply Web</h2>";
        $cuerpo .= "<p><strong>Nombre:</strong> " . $_POST['nombre'] . "</p>";
        $cuerpo .= "<p><strong>Correo:</strong> " . $_POST['correo'] . "</p>";
        $cuerpo .= "<p><strong>Contacto:</strong> " . $_POST['telefono'] . "</p>";
        $cuerpo .= "<p><strong>Mensaje:</strong><br>" . nl2br($_POST['mensaje']) . "</p>";

        $mail->Body = $cuerpo;

        $mail->send();
        echo "Mensaje enviado con éxito";
    } catch (Exception $e) {
        echo "Error al enviar: {$mail->ErrorInfo}";
    }
}
?>