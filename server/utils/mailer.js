const sendEmail = async (to, subject, html) => {
    try {
      const { Resend } = await import('resend'); // dynamic import
      const resend = new Resend('re_LZ6xoJXv_3z8avVQ169RfYUNMhkh5782s');
  
      const data = await resend.emails.send({
        from: 'Clive Hakaperi BRBC Systems Developer <onboarding@resend.dev>',
        to,
        subject,
        html,
      });
  
      console.log('Email sent ✅:', data?.id);
    } catch (err) {
      console.log('Email error ❌', err);
    }
  };
  
  module.exports = sendEmail;
  