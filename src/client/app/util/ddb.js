
export const typeToRepr = {
  "B": "Binary",
  "BOOL": "Boolean",
  "BS": "Boolean Set",
  "L": "List",
  "M": "Map",
  "N": "Number",
  "NS": "Number Set",
  "NULL": "Null",
  "S": "String",
  "SS": "String Set"
}

export const typeToZeroValue = {
  "B": "",
  "BOOL": false,
  "BS": [],
  "L": [],
  "M": {},
  "N": "0",
  "NS": [],
  "NULL": false,
  "S": "",
  "SS": []
}


export function getAttrType(table, attrName) {
  let attrDefn = table.AttributeDefinitions.find(k => k.AttributeName == attrName)
  return attrDefn ? attrDefn.AttributeType : null;
}
