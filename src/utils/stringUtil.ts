
/**
* Retorna un Texto en forma de Titulo 
* @param text 
* @returns 
*/
export function toTitleCase(text: string): string {
    return text.split(' ')
        .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
        .join(' ');
}