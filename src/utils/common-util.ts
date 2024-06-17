

export function isDefined(value: any): boolean {
  return typeof value !== "undefined" && value !== null;
}



export function isEmpty(value: any): boolean {
  return !isDefined(value) || value === '';
}

export function toString(value: any): string {
  return (typeof value === "undefined") ? '' : value;
}

export function fBoolean(inputValue: boolean): string {
  return inputValue === true ? 'Si' : 'No';
}

/**
 * Remplaza los valores null de un objeto por emprty
 * @param value
 * @returns
 */
export function getObjectFormControl(value: object): object {
  const cloneObjUpdate: any = { ...value };
  Object.keys(value).forEach(key => {
    if (cloneObjUpdate[key] === null) cloneObjUpdate[key] = '';
  });
  return cloneObjUpdate;
}

/**
 * Retorna el tipo de dispositivo
 * @returns
 */
export function getDevice(): string {

  const { userAgent } = navigator;
  let browserName = "";
  let device = "Desktop";
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    device = "Mobile"
  }

  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = "Chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = "Firefox";
  } else if (userAgent.match(/safari/i)) {
    browserName = "Safari";
  } else if (userAgent.match(/opr\//i)) {
    browserName = "Opera";
  } else if (userAgent.match(/edg/i)) {
    browserName = "Edge";
  } else if (userAgent.match(/android/i)) {
    browserName = "Android";
  } else if (userAgent.match(/iphone/i)) {
    browserName = "iPhone";
  }
  return `${device} ${browserName}`.trim();
}
