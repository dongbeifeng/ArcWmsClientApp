export function randomString(length: number) {
    const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i: number = length; i > 0; i-=1)
      result += str[Math.floor(Math.random() * str.length)];
    return result;
  }
