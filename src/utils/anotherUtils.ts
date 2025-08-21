export const updateMetadata = (selector: string, attribute: string, content: string) => {
    const element = document.querySelector(selector);
    if (element) {
        element.setAttribute(attribute, content);
    }
};