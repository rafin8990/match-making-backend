import nodemailer from 'nodemailer'

export const hypendPhoneNumber = (phoneNumber: string | undefined): string => {
    
    if (!phoneNumber || phoneNumber.trim() === '') {
        return ''; 
    }
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    const countryCodeLength = cleanedNumber.length > 10 ? cleanedNumber.length - 10 : 0;
    const countryCode = countryCodeLength > 0 ? cleanedNumber.slice(0, countryCodeLength) : '';
    const localNumber = cleanedNumber.slice(countryCodeLength);

    let formattedLocalNumber: string;
    if (localNumber.length >= 8) {
        formattedLocalNumber = localNumber.replace(/(\d{3})(\d{3})(\d{2})/, '$1-$2-$3');
    } else if (localNumber.length === 7) {
        formattedLocalNumber = localNumber.replace(/(\d{3})(\d{4})/, '$1-$2');
    } else {
        formattedLocalNumber = localNumber; 
    }
    return countryCode ? `+${countryCode}-${formattedLocalNumber}` : formattedLocalNumber;
};


export const sendMatchRequest = async (to: string, subject: string, userId: string,firstName:string,lastName:string,email:string,phoneNumber:string, selectedImage:string) => {
  try {
    const url = 'https://pamojafm.world/invitation'
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587, 
      secure: false, 
      auth: {
        user: 'fmawji@pamojafm.world',
        pass: 'HnUda8AG$K',
      }
    });

    const mailOptions = {
      from: 'fmawji@pamojafm.world',
      to,
      subject,
      html:`

      <img src="cid:logo" style="width: 150px;" alt="Logo" />
      <p>You have a new match request. View details at: <a href="${url}/${userId}">${url}/${userId}</a></p>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Number:</strong> ${hypendPhoneNumber(phoneNumber)}</p>
      <img style="border-radius: 50%; width: 160px; height: 160px; object-fit: cover;" src="${selectedImage}" alt="user Image" />
      `,
      attachments: [
        {
          filename: "logo.png",
          path: "./images/logo.png",
          cid: "logo", 
        },
      ],
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
   
      console.error('Error occurred after headers were sent:', error);
  }
};