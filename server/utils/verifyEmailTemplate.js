const verifyEmail = ({ name, url }) => {
    return `
    <p>Dear ${name}</p>
    <p>Thank you for registering on YumRunLK</p>
    <a href=${url} style="color:white;background:black;margin-top : 10px " >Click here to verify your email</a>
`

}

export default verifyEmailTemplate;
