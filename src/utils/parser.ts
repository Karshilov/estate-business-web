const HTMLParser = (value: string) => {
    let abstract = value.split(/<[^<>]*>/).join('')
    return abstract;
}

export default HTMLParser;