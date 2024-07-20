const parseJsonToObject = (json: string) => {
  let parseJson = {}
  try {
    parseJson = JSON.parse(json);
  } catch (error) {
    parseJson = JSON.parse('{}');

  }
  return parseJson;
}

export const system ={
  parseJsonToObject
}
