export async function handler() {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      status: 'ok',
      palace: 'صرح المحامية عليا عبابنة',
      love: 'قيس وعليا للأبد ❤️',
      provider: 'Netlify Functions'
    })
  };
}
