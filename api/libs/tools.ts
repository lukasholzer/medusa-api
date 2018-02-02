export function validateEventBody(body: any) {

  let result: Object;

  try {
    result = JSON.parse(body);
  } catch (error) {
    console.error(`No Valid Object was provided! \n`);
    return;
  }

  if (typeof result !== 'object') {
    console.error(`Body is not an Object! \n\n`);
    return;
  }

  return result;
}
