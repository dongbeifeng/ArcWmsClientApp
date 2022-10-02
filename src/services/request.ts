// // import { request } from 'umi';
// import { extend } from 'umi-request';

// request.interceptors.request.use(async (url, options) => {
//   console.log(options)
//   console.log(url)
//     if (
//       options.method === 'post' ||
//       options.method === 'put' ||
//       options.method === 'delete' ||
//       options.method === 'get'
//     ) {
//       const headers = {
//         // 'Content-Type': 'application/json',
//         // Accept: 'application/json',
//         token:localStorage.getItem("token")
//       };
//       return {
//         url,
//         options: { ...options, headers },
//       };
//     }
//   });



// request.interceptors.response.use(async (response, options) => {
//   let result;
//   console.log(response)
//   // const data = await response.clone().json();
//   // if (data.code !== '0') {
//   //    // 界面报错处理
//   // } else {
//     result = response;
//   // }
//   return result;
// });