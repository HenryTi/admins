
export const mobileRegex = /^[0-9]*$/;
export const emailRegex = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
// /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/

export const EmailFieldRule = (value:any): string|string[] => {
    if (emailRegex.test(value as string) === false) return '电子邮件格式错误';
}

export const MobileFieldRule = (value:any): string|string[] => {
    if (emailRegex.test(value as string) === false) return '手机格式错误';
}
